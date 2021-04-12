//We use EC6 modules!
import {extractJSON, fileResponse, htmlResponse, responseAuth, jsonResponse, reportError, startServer} from "./server.js";
import {createUser, createGroup, createMessage, showAllTableContent} from "./database.js";
import {printChatPage} from "./siteChat.js"; // DET skal væk når chatHack er SLET
import {printLoginPage} from "./siteLogin.js";

const ValidationError="Validation Error";
const NoResourceError="No Such Resource";
export {ValidationError, NoResourceError, processReq};
startServer();

//constants for validating input from the network client
const minLoginLength=1;
const maxLoginLength=50;

//throw(new Error("kat"));

//remove potentially dangerous/undesired characters 
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

function validateLoginData(loginData){
	console.log("Validating");
	let email;
	let password;
	try { 
		email = String(loginData.email);
		email = sanitize(email); // Vi skal lige finde ud af om det skal være der
		password = String(loginData.password);
		password = sanitize(password); // Vi skal lige finde ud af om det skal være der

	}catch(e){console.log("Invalid "+e);throw(new Error(ValidationError));}
  
	if((email.length>=minLoginLength) && (email.length<=maxLoginLength) &&
		(password.length>=minLoginLength) && (password.length<=maxLoginLength)) {
		let validloginData={email: loginData.email, password: loginData.password};
		console.log("Validated: "); console.log(validloginData);
		return validloginData;
	} 
  	else throw(new Error(ValidationError));
}

function validateUserData(userData) {
	// Validates user ID by validating if group ID is an integer
	if (userData.user_id === parseInt(userData.user_id,10)) {
        return userData;
	}  
	else {
        console.log("User ID is not valid");
    }
	return userData;
}

function validateGroupData(groupData) {
	// Validates group ID
	if (isGroupValid(groupData.group_member_id1) &&
		isGroupValid(groupData.group_member_id2) &&
		isGroupValid(groupData.group_member_id3) &&
		isGroupValid(groupData.group_member_id4)) {
		return groupData;
	}
	else {
		throw(new Error(ValidationError));
	}
}

function validateMessageData(messageData) {
	// Character limit in chatbox 
	const content_limit = 200;
	if (isStringTooLong(messageData.msg_content, content_limit)) {
		return messageData;
	}
	else {
		throw(new Error(ValidationError));
	}
}

function isStringTooLong (string, max_length){
	//Help function to validate if string is too long. 
    if (string.length >= max_length) {
		console.log("Too many characters");
		return false
	}
	else 
        return true;
}

function isGroupValid(memberID){
	//Help function to validateGroupData
	if (memberID === parseInt(memberID,10)){
		return true;
	}
	else {
		console.log("group member ID not valid");
		return false
	}
}

/* *********************************************************************
   Setup HTTP route handling: Called when a HTTP request is received 
   ******************************************************************** */
function processReq(req, res) {
	//console.log("GOT: " + req.method + " " +req.url);
	let baseURL = 'http://' + req.headers.host + '/';    //https://github.com/nodejs/node/issues/12682
	let url=new URL(req.url,baseURL);
	let searchParms=new URLSearchParams(url.search);
	let queryPath=decodeURIComponent(url.pathname); //Convert uri encoded special letters (eg æøå that is escaped by "%number") to JS string

	switch(req.method) {
		case "POST": {
		let pathElements=queryPath.split("/"); 
		console.log(pathElements[1]);
		switch(pathElements[1]){
			case "/makeUser":
			case "makeUser": 
				extractJSON(req)
					.then(userData => validateUserData(userData))
					.then(validatedData => jsonResponse(res, createUser(validatedData)))
					.catch(err=>reportError(res,err));
			break;
			case "/makeGroup":
			case "makeGroup": 
				extractJSON(req)
					.then(groupData => validateGroupData(groupData))
					.then(validatedData => jsonResponse(res, createGroup(validatedData)))
					.catch(err=>reportError(res,err));
			break;
			case "/makeMessage":
			case "makeMessage": 
				extractJSON(req)
					.then(messageData => validateMessageData(messageData))
					.then(validatedData => jsonResponse(res, createMessage(validatedData)))
					.catch(err=>reportError(res,err));
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
			switch(pathElements[1]){     
				case "": 
					htmlResponse(res, printLoginPage());
				break;
				case "chat": 
					responseAuth(req, res);
				break;
				case "chatHack": // SLET det her
					htmlResponse(res, printChatPage(1));
				break;
				case "showAllTable": 
					showAllTableContent(res);
				break;
				default: //for anything else we assume it is a file to be served
					fileResponse(res, req.url);
				break;
			}//path
		}//switch GET URL
		break;
		default:
			reportError(res, NoResourceError); 
	} //end switch method
}
