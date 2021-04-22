//We use EC6 modules!
//Importing functions from other files
import {extractJSON, fileResponse, htmlResponse, responseAuth, jsonResponse, SSEResponse, startServer, broadcastMsgSSE} from "./server.js";
import {createUser, createGroup, createMessage, showAllTableContent, createInterest, getUserEmail} from "./database.js";
import {printChatPage} from "./siteChat.js"; // DET skal væk når chatHack er SLET
import {printLoginPage} from "./siteLogin.js";
import {ValidationError, NoResourceError, reportError} from "./errors.js";
import {makeFriends} from "./groups.js";


//Global constants

export {processReq};

startServer(); 

//Constants for validating input from the network client
const sMin=1;
const minPasLen=8;
const maxNameLen=15;
const maxPasMailLen=30;
const maxStudyLen=30;

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
				study: String(userData.study)
			}
		} catch {
			reject(new Error(ValidationError))
		}
		if (isStrLen(validData.psw, minPasLen, maxPasMailLen) && 
			isStrLen(validData.mail, sMin, maxPasMailLen) &&
			isStrLen(validData.fname, sMin, maxNameLen) && 
			isStrLen(validData.lname, sMin, maxNameLen) && 
			isStrLen(validData.birthDate, sMin, maxNameLen) &&
			isStrLen(validData.study, sMin, maxStudyLen))
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
	function validateEmail(email) {
		return /\S+@\S+\.\S+/.test(email);
	}
	function isStrLen(str, minLength, maxLength) {
		if (str >= minLength && str <= maxLength)
			return false
		return true;
	}
}

function validateGroupData(groupData) {
	return new Promise((resolve,reject) => {
		if (isInteger(groupData.member_id1) &&
			isInteger(groupData.member_id2) &&
			isInteger(groupData.member_id3) &&
			isInteger(groupData.member_id4) &&
			isInteger(groupData.member_id5)) {
			resolve(groupData);
		}
		else {
			reject(new Error(ValidationError));
		}
	});	
}

function validateMessageData(messageData) {
	return new Promise((resolve,reject) => {
		const content_limit = 2000;	// Character limit in chatbox 
		let validData;
		try {
			validData = {
				msg_content: String(messageData.msg_content),
				user_id: messageData.user_id,
				group_id: messageData.group_id,
				fname: messageData.fname,
				lname: messageData.lname
			}
		} catch {
			reject(new Error(ValidationError))
		}
		if (validData.msg_content >= content_limit || validData.msg_content.length < 1) {
			reject(new Error(ValidationError));
		}
		else if(isInteger(validData.user_id) && isInteger(validData.group_id)) {
			resolve(validData);
		}
		else 
			reject(new Error(ValidationError));
	});
}

function isInteger(number){
	if (number === parseInt(number,10) || number === null)
		return true;
	else {
		console.error("Not integer");
		return false
	}
}

//Setup HTTP route handling: Called when a HTTP request is received | req=request & res = response
function processReq(req, res) {
	//console.log("GOT: " + req.method + " " +req.url); HUSK AT SLE>TTE DET HER
	let baseURL = 'http://' + req.headers.host + '/'; //https://github.com/nodejs/node/issues/12682
	let url = new URL(req.url,baseURL);
	let searchParms = new URLSearchParams(url.search);
	let queryPath = decodeURIComponent(url.pathname); //Convert url encoded special letters (eg æøå that is escaped by "%number") to JS string

	//Switching on request methods POST or GETn eg
	switch(req.method) {
		case "POST": {
		let pathElements=queryPath.split("/"); 
		switch(pathElements[1]) {
			case "/makeUser":
			case "makeUser": 
				extractJSON(req)
					.then(userData => validateUserData(userData))
					.then(validatedData => createUser(validatedData))
						.then(response => jsonResponse(res, response))
						.catch(err => reportError(res, err))
					.catch(err => reportError(res, err));
			break;
			case "/makeInterest":
			case "makeInterest": 
				extractJSON(req)
					//.then(userData => validateUserData(userData))
					.then(validatedData => jsonResponse(res, createInterest(validatedData)))
					.catch(err => reportError(res, err));
			break;
			case "/makeGroup":
			case "makeGroup": 
				extractJSON(req)
					.then(groupData => validateGroupData(groupData))
					.then(validatedData => createGroup(validatedData)
						.then(response => jsonResponse(res, response)))
						.catch(err => reportError(res, err))
					.catch(err => reportError(res, err));
			break;
			case "/newMessageSSE":
			case "newMessageSSE": 
				extractJSON(req)
					.then(messageData => validateMessageData(messageData))
					.then(validatedData => {
						createMessage(validatedData)
						.then(() => broadcastMsgSSE(req, res, validatedData))
						.catch(err => reportError(res, err));
					}).catch(err => reportError(res, err));
			break;
			default: 
				console.error("Resource doesn't exist");
				reportError(res, NoResourceError); 
			}
		} 
		break; //POST URL
		case "GET":{
			let pathElements=queryPath.split("/"); 
			//console.log(pathElements);
			//USE "sp" from above to get query search parameters
			switch(pathElements[1]) {
				case "": 
					htmlResponse(res, printLoginPage());
				break;
				case "/chat":
				case "chat": 
					responseAuth(req, res, searchParms.get("groupID"));
				break;
				case "/chatSSE":
				case "chatSSE": 
					SSEResponse(req, res);
				break;
				case "/chatHack": // NOT GOOD
				case "chatHack": // SLET det her - det er hackerbrian der er på spil
					htmlResponse(res, printChatPage(1,""));
				break;
				case "/showAllTable": // NOT GOOD
				case "showAllTable":  // SLET det her
					showAllTableContent(res);
				break;
				case "/creategroups":
					case "creategroups": 
						makeFriends()
					break;
				default: //For anything else we assume it is a file to be served
					fileResponse(res, req.url);
				break;
			}//path
		}//switch GET URL
		break;
		default:
			reportError(res, NoResourceError); 
	} //end switch method
}
