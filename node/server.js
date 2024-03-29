//THIS APP USES ES6 MODULES  
import http from 'http';
import fs from "fs";
import path  from "path";
import process from "process";

import {processReq, groupSize, startAutoCreateGroups} from "./app.js";
import {ValidationError, AuthError, NoAccessGroupError, InternalError, MessageTooLongError, reportError} from "./errors.js";
import {login, getGroups, getGroupMembers, getAllUserId, createGroup} from "./database.js";
import {printChatPage} from "./siteChat.js";
export {startServer, extractJSON, adminGetUser, adminMakeGroup, adminRunGroupAlg, fileResponse, acceptNewClient, broadcastMsgSSE, responseAuth,jsonResponse,errorResponse, createEventMsg};

const port = 3280; //Port of node0
const hostname = "127.0.0.1";

const reqCharLimit = 10000000; //10 MB limit!
const publicResources="/PublicResources/"; // Define path for public resources
let clientsSSE = []; //List of online clients for SSE

//Secture file system access as described on https://nodejs.org/en/knowledge/file-system/security/introduction/
const rootFileSystem=process.cwd();
function securePath(userPath){
	if (userPath.indexOf('\0') !== -1) {
		return undefined;
	}
	userPath = publicResources+userPath;
	let p = path.join(rootFileSystem,path.normalize(userPath)); 
	return p;
}

//Send contents as file as response
function fileResponse(res, filename){
	const sPath=securePath(filename);
	fs.readFile(sPath, (err, data) => {
		if (err) {
			console.error(err);
			errorResponse(res,404,String(err));
		}else {
			res.statusCode = 200;
			res.setHeader('Content-Type', getFileType(filename));
			res.write(data);
			res.end('\n');
		}
	});
}

//Converts filename suffix to the corresponding HTTP content type
function getFileType(fileName){
	const fileExtension=fileName.split('.').pop().toLowerCase();
	const ext2Mime ={ 
		"txt": "text/txt",
		"html": "text/html",
		"ico": "image/ico",
		"js": "text/javascript",
		"json": "application/json", 
		"css": 'text/css',
		"png": 'image/png',
		"jpg": 'image/jpeg',
		"wav": 'audio/wav',
		"mp3": 'audio/mpeg',
		"svg": 'image/svg+xml',
		"pdf": 'application/pdf',
		"doc": 'application/msword',
		"docx": 'application/msword'
	};
	return (ext2Mime[fileExtension]||"text/plain");
}

//Special admin login for maintenance. Runs groups algorithm that makes new groups
function adminRunGroupAlg(req, res) {
	return new Promise((resolve,reject) => {
		let authheader = req.headers.authorization;
		if (!authheader) {
			reportError(res, new Error(AuthError))
			reject();
		}
		if (authheader === "Basic amFrb2I6a2F0ZW41NQ==") { // base64 encoded admin username and password
			sendResponse(res, 200, "Running group algorithm", "text/txt", null);
			resolve();
		}
		else {
			reportError(res, new Error(AuthError))
			reject();
		}
	});
}

//Special admin login for maintenance. Gets data from all users
function adminGetUser(req, res) {
	let authheader = req.headers.authorization;
	if (!authheader) 
		reject(new Error(AuthError));
	if (authheader === "Basic amFrb2I6a2F0ZW41NQ==") { // base64 encoded admin username and password
		getAllUserId().then(users => {
			let print = "";
			for (const user of users) 
				print += user.user_id + " | " + user.fname + " | " + user.study + "\n"; 
			sendResponse(res, 200, print, "text/txt", null);
		});
	}
	else {
		reject(new Error(AuthError));
	}
}

//Special admin login for maintenance. Makes group. JSON defines the group members
function adminMakeGroup(req, res, data) {
	let authheader = req.headers.authorization;
	if (!authheader) 
		reject(new Error(AuthError));
	if (authheader === "Basic amFrb2I6a2F0ZW41NQ==") { // base64 encoded admin username and password
		createGroup(data).then(function() {	
			sendResponse(res, 200, "Group created", "text/txt", null);
		}).catch(function() {
			sendResponse(res, 400, "An error occurred", "text/txt", null);
		});
	}
	else {
		reject(new Error(AuthError));
	}
}

//Checks the authorization headers matches a user en DB and returns the loginResult(userID) 
function isAuthenticated(req) {
	return new Promise((resolve,reject) => {
		let authheader = req.headers.authorization;
		if (!authheader) 
			reject(new Error(AuthError));
		let auth = new Buffer.from(authheader.split(' ')[1],'base64').toString().split(':');
		let loginData = {
			email: auth[0],
			password: auth[1]
		};
		login(loginData).then(loginResult => {
			if (loginResult[0] !== undefined) {
				resolve(loginResult);
				return loginResult;
			}
			else {
				reject(new Error(AuthError));
			}
		});
	});
}

// This handles GET requests for the /chatSSE endpoint which are generated when
// the client creates a new EventSource object (or when the EventSource
// reconnects automatically)
function acceptNewClient(req, res) {
	isAuthenticated(req).then(loginResult => {
		let clientsSSEObj = {
			SSEres: res,
			SSEuserID: loginResult[0].user_id
		}
		clientsSSE.push(clientsSSEObj); // Remember the response object so messages can be send in future

		req.connection.on("end", () => {
			clientsSSE.splice(clientsSSE.indexOf(res), 1);
		});
		res.writeHead(200, {  // Set headers and send an initial chat event to just this one client
			"Content-Type": "text/event-stream", 
			"Connection": "keep-alive",
			"Cache-Control": "no-cache"
		});
		res.write("event: chat\ndata: \n\n"); // Keeping the connection open -> No response.end()
	}).catch(err => reportError(res, err));
}

//Checks authorisation and set res to html site
function responseAuth(req, res, parmsGroupID) {
	isAuthenticated(req).then(loginResult => {
		printChatPage(loginResult[0].user_id, loginResult[0].fname, parmsGroupID)
			.then(html => htmlChatResponse(res, html, loginResult[0].user_id, loginResult[0].fname, loginResult[0].lname))
			.catch(err => console.error(err));
	}).catch(err => reportError(res, err));
}

//HTML response with added headers
function htmlChatResponse(res, htmlString, user_id, fname, lname){
	let objHeaderArr = [];
	objHeaderArr.push({key: "user_ID", value: user_id});
	objHeaderArr.push({key: "fname", value: fname});
	objHeaderArr.push({key: "lname", value: lname});
	sendResponse(res, 200, htmlString, "text/html", objHeaderArr);
}

// Broadcast new message from SSE
async function broadcastMsgSSE(req, res, data) {
	res.writeHead(200).end();
	let loginResult = await isAuthenticated(req); 
	data.user_id = loginResult[0].user_id;
	let groupID;
	let groupsData = await getGroups(loginResult[0].user_id);
	for (const group of groupsData) {
		if (data.group_id === group.group_id) // Is the user a part of group from JSON data?
			groupID = group.group_id;
	}
	if (!groupID) 
		throw new Error(NoAccessGroupError);
	let groupsMembers = await getGroupMembers(groupID);
	for (const client of clientsSSE) {
		if (isUserIdInGroup(groupsMembers, client.SSEuserID)) 
			client.SSEres.write(createEventMsg(data));
	}
	return data;
}

//Format object as SSE event message
function createEventMsg(dataStr) {
	let message = "data: " + JSON.stringify(dataStr).replace("\n", "\ndata: ");
	return `event: chat\n${message}\n\n`;
}

//is the user ID from authorization headers in the group from request body
function isUserIdInGroup(groupsMembers, userId) {
	for (let i = 1; i <= groupSize; i++) {
		let key = "member_id"+i; 
		if (groupsMembers[key] === userId) 
			return true;
	}
	return false;
}

/********* Response handling *********/
// Send a error response with a given HTTP error code, and reason string 
function errorResponse(res, code, reason) {
	sendResponse(res, code, "Error:" + code + " - " + reason, "text/txt", null)
}

// Send 'obj' object as JSON as response
function jsonResponse(res, obj) {
	sendResponse(res, 200, JSON.stringify(obj), "application/json", null)
}

// Writes, sets headers and statusCode on response 
function sendResponse(res, code, writeStr, conType, objHeaderArr) {
	res.statusCode = code;
	res.setHeader("Content-Type", conType);
	if (objHeaderArr) {
		for (const objHead of objHeaderArr)
			res.setHeader(objHead.key, objHead.value);
	}
	res.write(writeStr);
	res.end('\n');
}

/********* Request handling *********/

// Extracts json to object
function extractJSON(req) {
	if (isJsonEncoded(req.headers['content-type']))
	return collectPostBody(req).then(body=> {
		let jsonBody = JSON.parse(body);
		return jsonBody;
	}).catch(err => Promise.reject(err));
	else
		return Promise.reject(new Error(ValidationError)); //create a rejected promise
}

// Check if first header is application/json
function isJsonEncoded(contentType) {
	let ctType = contentType.split(";")[0];
	ctType = ctType.trim();
	return (ctType === "application/json"); 
}

/* As the body of a POST may be long the HTTP modules streams chunks of data
   that must first be collected and appended before the data can be operated on. 
   This function collects the body and returns a promise for the body data */
function collectPostBody(req) {
	return new Promise((resolve,reject) => {
		if (1 > 1e7) {  // Protect againts DoS attack if sending an very very large post body
			req.connection.destroy();
			reject(new Error(MessageTooLongError));
		}
		let bodyData = [];
		let length = 0;
		req.on('data', (chunk) => {
			bodyData.push(chunk);
			length+=chunk.length; 
		
			if (length > reqCharLimit) {
				reject(new Error(MessageTooLongError));
			}
		}).on('end', () => {
			bodyData = Buffer.concat(bodyData).toString(); //By default, Buffers use UTF8
			resolve(bodyData); 
		});
	});
}

/********* Setup HTTP server and route handling *********/

//This is the server object. For every request, the function requestHandler is called
const server = http.createServer(requestHandler);

function requestHandler(req,res) {
	try {
		processReq(req,res);
	}catch(err) {
		console.log(InternalError +  "!!: " + err);  
	errorResponse(res,500,"");
	}
}

//Start server listening for request on port and hostname
function startServer(){
	startAutoCreateGroups();
	server.listen(port, hostname, () => {
		console.log("Server is running");
	});
}
