//We use EC6 modules!
//Importing functions from other files
import {extractJSON, fileResponse, responseAuth, jsonResponse, SSEResponse, startServer, broadcastMsgSSE} from "./server.js";
import {createUser, createMessage, getUserEmail} from "./database.js";
import {ValidationError, NoResourceError, reportError} from "./errors.js";
import {createNewGroups} from "./groups.js";
import {createAllNewUsers} from "./createAllUsers.js";
import {runTesting} from "./testing.js";
export {processReq, startAutoCreateGroups, isStrLen, validateEmail, groupSize};

startServer(); 
runTesting();

//Global constants
const groupSize = 5; //min 3 max 12

//Constants for validating input from the network client
const sMin=1;
const minPasLen=8;
const maxNameLen=15;
const maxPasMailLen=30;

//Remove potentially dangerous/undesired characters 
function sanitize(str){
	str=str
	.replace(/&/g, "")
	.replace(/</g, "")
	.replace(/>/g, "")
	.replace(/"/g, "")
	.replace(/'/g, "")
	.replace(/`/g, "")
	.replace(/\//g, "");
	return str.trim();
}

function validateUserData(userData) {
	return new Promise((resolve,reject) => {
		let validData;
		try {
			validData = {
				psw: String(sanitize(userData.psw)),
				fname: String(sanitize(userData.fname)),
				lname: String(sanitize(userData.lname)),
				mail: String(userData.mail).toLowerCase(),
				birthDate: userData.birthDate,
				study: Number(userData.study)
			}
		} catch {
			reject(new Error(ValidationError))
		}
		if (isStrLen(validData.psw, minPasLen, maxPasMailLen) || 
			isStrLen(validData.mail, sMin, maxPasMailLen) ||
			isStrLen(validData.fname, sMin, maxNameLen) || 
			isStrLen(validData.lname, sMin, maxNameLen))
				reject(new Error(ValidationError));
				
		if (!validateEmail(userData.mail))
			reject(new Error(ValidationError));
		else {
			getUserEmail(userData.mail).then(result => {
				if (result[0])
					reject(new Error(ValidationError)); // make const for this 
				else 
					resolve(validData);
			}).catch(err => reject(new Error(err)));
		}
	});
}

function validateEmail(email) {
	return /\S+@\S+\.\S+/.test(email);
}

function isStrLen(str, minLength, maxLength) {
	if (str.length >= minLength && str.length <= maxLength) 
		return false;
	return true;
}

function validateMessageData(messageData) {
	return new Promise((resolve,reject) => {
		const content_limit = 2000;	// Character limit in chatbox 
		let validData;
		try {
			validData = {
				msg_content: String(messageData.msg_content),
				group_id: Number(messageData.group_id),
				fname: String(sanitize(messageData.fname)),
				lname: String(sanitize(messageData.lname))
			}
		} catch {
			reject(new Error(ValidationError))
		}
		if (isStrLen(validData.fname, sMin, maxNameLen) || 
			isStrLen(validData.lname, sMin, maxNameLen))
				reject(new Error(ValidationError));
		else if (validData.msg_content.length >= content_limit || validData.msg_content.length < 1) {
			reject(new Error(ValidationError));
		}
		else if(isInteger(validData.group_id)) {
			resolve(validData);
		}
		else 
			reject(new Error(ValidationError));
	});
}

function isInteger(number){
	if (number === parseInt(number,10) || number === null) 
		return true;
	else 
		return false;
}

//Setup HTTP route handling: Called when a HTTP request is received | req=request & res = response
function processReq(req, res) {	
	try {
		let baseURL = 'http://' + req.headers.host + '/'; //https://github.com/nodejs/node/issues/12682
		let url = new URL(req.url,baseURL);
		let searchParms = new URLSearchParams(url.search);
		let queryPath = decodeURIComponent(url.pathname); //Convert url encoded special letters (eg æøå that is escaped by "%number") to JS string
		let pathElements=queryPath.split("/"); 

		switch(req.method) {
			case "POST": 
				postHandler(req, res, pathElements[1]);
				break;
			case "GET": 
				getHandler(req, res, pathElements[1], searchParms)
				break;
			default:
				reportError(res, new Error(NoResourceError)); 
		} 
	} catch {
		reportError(res, new Error(ValidationError)); 
	}
}

function postHandler(req, res, path) {
	switch(path) {
		case "/makeUser":
		case "makeUser": 
			extractJSON(req)
				.then(userData => validateUserData(userData))
				.then(validatedData => createUser(validatedData))
					.then(response => jsonResponse(res, response))
					.catch(err => reportError(res, err))
				.catch(err => reportError(res, err));
		break;
		case "/newMessageSSE":
		case "newMessageSSE": 
			extractJSON(req)
				.then(messageData => validateMessageData(messageData))
				.then(validatedData => {
					broadcastMsgSSE(req, res, validatedData)
					.then(returnData => createMessage(returnData))
					.catch(err => reportError(res, err));
				}).catch(err => reportError(res, err));
		break;
		default: 
			console.error("Resource hello exist");
			reportError(res, new Error(NoResourceError)); 
	} 
}

function getHandler(req, res, path, searchParms) {
	switch(path) {
		case "": 
			fileResponse(res, "html/login.html");
		break;
		case "/chat":
		case "chat": 
			responseAuth(req, res, searchParms.get("groupID"));
		break;
		case "/chatSSE":
		case "chatSSE": 
			SSEResponse(req, res);
		break;
		case "/createAccount":
		case "createAccount": 
			fileResponse(res, "html/createAccount.html");
		break;
		case "/createAllNewUsers": // DEMO
		case "createAllNewUsers": // DEMO
			createAllNewUsers(); // DEMO
		break; // DEMO
		default: //For anything else we assume it is a file to be served
			fileResponse(res, req.url);
		break;
	}
}

function startAutoCreateGroups() {
	let now = new Date();
	let millisLeft = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 16, 0, 0, 0) - now; // milliseconds until 16 o'clock
	if (millisLeft < 0) {
		millisLeft += 86400000; // it's after 16 o'clock, try at 16 o'clock tomorrow.
	}
	setTimeout(function(){createNewGroups(); startAutoCreateGroups()}, millisLeft);
}