//THIS APP USES ES6 MODULES  
import http from 'http';
import fs from "fs";
import path  from "path";
import process from "process";

import {processReq} from "./app.js";
import {ValidationError, AuthError, InternalError, reportError} from "./errors.js";
import {login, getGroups, getGroupMembers} from "./database.js";
import {printChatPage} from "./siteChat.js";
export {startServer,extractJSON, extractForm, fileResponse, SSEResponse, broadcastMsgSSE, htmlResponse,responseAuth,jsonResponse,errorResponse};

const port = 3280; //Port of node0
const hostname = "127.0.0.1";

let clientsSSE = []; //List of online clients for SSE (Server-sent events)

const publicResources="/PublicResources/"; // Define path for public resources
//secture file system access as described on 
//https://nodejs.org/en/knowledge/file-system/security/introduction/
const rootFileSystem=process.cwd();
function securePath(userPath){
	if (userPath.indexOf('\0') !== -1) {
		// could also test for illegal chars: if (!/^[a-z0-9]+$/.test(filename)) {return undefined;}
		return undefined;
	}
	userPath = publicResources+userPath;
	let p = path.join(rootFileSystem,path.normalize(userPath)); 
	//console.log("The path is:"+p);
	return p;
}

// send contents as file as response
function fileResponse(res, filename){
	const sPath=securePath(filename);
	//console.log("Reading:"+sPath);
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
function SSEResponse(req, res) {
	isAuthenticated(req).then(loginResult => {
		let clientsSSEObj = {
			SSEreq: req,
			SSEres: res,
			SSEuserID: loginResult[0].user_id
		}
		clientsSSE.push(clientsSSEObj); // Remember the response object so messages can be send in future

		req.connection.on("end", () => {
			clientsSSE.splice(clientsSSE.indexOf(res), 1);
			res.end();
		});
		res.writeHead(200, {  // Set headers and send an initial chat event to just this one client
			"Content-Type": "text/event-stream", 
			"Connection": "keep-alive",
			"Cache-Control": "no-cache"
		});
		res.write("event: chat\ndata: \n\n"); // Keeping the connection open -> No response.end()
	}).catch(err => reportError(res, err));
}

function htmlResponse(res, htmlString){
	res.statusCode = 200;
	res.setHeader('Content-Type', "text/html");
	res.write(htmlString);
	res.end('\n');
}

function responseAuth(req, res) {
	isAuthenticated(req).then(loginResult => {
		console.log(loginResult[0].user_id);
		printChatPage(loginResult[0].user_id, loginResult[0].fname, loginResult[0].lname, req.url)
			.then(html => htmlResponseCHeader(res, html, loginResult[0].user_id, loginResult[0].fname, loginResult[0].lname))
			.catch(err => console.error(err));
	}).catch(err => reportError(res, err));
}

function htmlResponseCHeader(res, htmlString, user_id, fname, lname){
	let groupID = 0;
	getGroups(user_id).then(groupsData => {
		for (const group of groupsData) {
			groupID = group.group_id;
			break;
		}
		res.statusCode = 200;
		res.setHeader('Content-Type', "text/html");
		res.setHeader('user_ID', user_id);
		res.setHeader('group_id', groupID);
		res.setHeader('fname', fname);
		res.setHeader('lname', lname);
		res.write(htmlString);
		res.end('\n');
	});
}

// THIS IS CRAZY!!!
async function broadcastMsgSSE(req, res, data) {
	try { 
		let loginResult = await isAuthenticated(req); 
		if (data.user_id === loginResult[0].user_id) {
			let message = "data: " + JSON.stringify(data);
			let event = `event: chat\n${message}\n\n`;
			let groupID = 0;
			let groupsData = await getGroups(loginResult[0].user_id);
			for (const group of groupsData) {
				if (data.group_id === group.group_id) // Is the user a part of group from JSON data?
					groupID = group.group_id;
			}
			let groupsMembers = await getGroupMembers(groupID);
			for (const client of clientsSSE) {
				//console.log(client.SSEuserID);
				if (groupsMembers[0].member_id1 === client.SSEuserID ||
					groupsMembers[0].member_id2 === client.SSEuserID ||
					groupsMembers[0].member_id3 === client.SSEuserID || 
					groupsMembers[0].member_id4 === client.SSEuserID || 
					groupsMembers[0].member_id5 === client.SSEuserID) {
					//console.log("TRUE"+ client.SSEuserID);
					res.writeHead(200).end();
					client.SSEres.write(event); //ERR_STREAM_WRITE_AFTER_END
				}
			}
		}
		else 
			console.error("The userID is not the logged in user's");
	}
	catch(err) {
		reportError(res, err); 
	}	
}

/* send a response with a given HTTP error code, and reason string */ 
function errorResponse(res, code, reason){
	res.statusCode=code;
	res.setHeader('Content-Type', 'text/txt');
	res.write("Error:" + code + " - " + reason);
	res.end("\n");
}

/* send 'obj' object as JSON as response */
function jsonResponse(res,obj){
	res.statusCode = 200;
	res.setHeader('Content-Type', 'application/json');
	res.write(JSON.stringify(obj));
	res.end('\n');
}

/* As the body of a POST may be long the HTTP modules streams chunks of data
   that must first be collected and appended before the data can be operated on. 
   This function collects the body and returns a promise for the body data
*/

/* protect againts DOS attack from malicious user sending an very very large post body.
if (body.length > 1e7) { 
  // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
  request.connection.destroy();
}
*/
const MessageTooLongError="MsgTooLong";
function collectPostBody(req){
  //the "executor" function
	function collectPostBodyExecutor(resolve,reject){
		let bodyData = [];
		let length=0;
		req.on('data', (chunk) => {
		bodyData.push(chunk);
		length+=chunk.length; 
	
		if(length>10000000) { //10 MB limit!
			req.connection.destroy(); //we would need the response object to send an error code
			reject(new Error(MessageTooLongError));
		}
		}).on('end', () => {
		bodyData = Buffer.concat(bodyData).toString(); //By default, Buffers use UTF8
		//console.log(bodyData);
		resolve(bodyData); 
		});
		//Exceptions raised will reject the promise
	}
	return new Promise(collectPostBodyExecutor);
}

function extractJSON(req){
	if(isJsonEncoded(req.headers['content-type']))
	return collectPostBody(req).then(body=> {
		let jsonBody = JSON.parse(body);
		//console.log(x);
		return jsonBody;
	});
	else
		return Promise.reject(new Error(ValidationError)); //create a rejected promise
}

/* extract the enclosed forms data in the pody of POST */
/* Returns a promise */
function extractForm(req){
	if(isFormEncoded(req.headers['content-type']))
		return collectPostBody(req).then(body=> {
		//const data = qs.parse(body);//LEGACY
		//console.log(data);
		let data=new URLSearchParams(body);
		return data;
		});
	else
		return Promise.reject(new Error(ValidationError));  //create a rejected promise
}

function isFormEncoded(contentType){
	//Format 
	//Content-Type: text/html; charset=UTF-8
	let ctType=contentType.split(";")[0];
	ctType=ctType.trim();
	return (ctType==="application/x-www-form-urlencoded"); 
	//would be more robust to use the content-type module and  contentType.parse(..)
	//Fine for demo purposes
}

function isJsonEncoded(contentType){
	//Format 
	//Content-Type: application/json; encoding
	let ctType=contentType.split(";")[0];
	ctType=ctType.trim();
	return (ctType==="application/json"); 
	//would be more robust to use the content-type module and  contentType.parse(..)
}

/* *********************************************************************
   Setup HTTP server and route handling 
   ******************************************************************** */
const server = http.createServer(requestHandler);
function requestHandler(req,res){
	try {
		processReq(req,res);
	}catch(e) {
		console.log(InternalError +"!!: " +e);  
	errorResponse(res,500,"");
	}
}

function startServer(){
	/* start the server */
	server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
	fs.writeFileSync('message.txt', `Server running at http://${hostname}:${port}/`);
	});
}
