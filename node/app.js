//We use EC6 modules!
//Importing functions from other files
import {extractJSON, fileResponse, responseAuth, jsonResponse, SSEResponse, startServer, broadcastMsgSSE} from "./server.js";
import {createUser, createGroup, createMessage, showAllTableContent, createStudy, getUserEmail} from "./database.js";
import {ValidationError, NoResourceError, reportError} from "./errors.js";
import {makeFriends} from "./groups.js";
import {createAllNewUsers} from "./createAllUsers.js";
export {processReq, grupeSize};

startServer(); 

//Global constants
const grupeSize = 5;

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
		if (!(isStrLen(validData.psw, minPasLen, maxPasMailLen) && 
			isStrLen(validData.mail, sMin, maxPasMailLen) &&
			isStrLen(validData.fname, sMin, maxNameLen) && 
			isStrLen(validData.lname, sMin, maxNameLen)))
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
			return false;
		return true;
	}
}

function validateGroupData(groupData) {
	return new Promise((resolve, reject) => {
		for (let i = 1; i <= grupeSize; i++) {
			let key = "member_id"+i; 
			if (!isInteger(groupData[key])) 
				reject(new Error(ValidationError));
		}
		resolve(groupData);
	});	
}

function validateMessageData(messageData) {
	return new Promise((resolve,reject) => {
		const content_limit = 2000;	// Character limit in chatbox 
		let validData;
		try {
			validData = {
				msg_content: String(messageData.msg_content),
				group_id: messageData.group_id,
				fname: messageData.fname,
				lname: messageData.lname
			}
		} catch {
			reject(new Error(ValidationError))
		}
		if (validData.msg_content.length >= content_limit || validData.msg_content.length < 1) {
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
	//console.log("GOT: " + req.method + " " +req.url); HUSK AT SLE>TTE DET HER
	let baseURL = 'http://' + req.headers.host + '/'; //https://github.com/nodejs/node/issues/12682
	let url = new URL(req.url,baseURL);
	let searchParms = new URLSearchParams(url.search);
	let queryPath = decodeURIComponent(url.pathname); //Convert url encoded special letters (eg æøå that is escaped by "%number") to JS string
	let pathElements=queryPath.split("/"); 
	//Switching on request methods POST or GETn eg
	
	switch(req.method) {
		case "POST": 
			postHandler(req, res, pathElements[1]);
			break;
		case "GET": 
			getHandler(req, res, pathElements[1], searchParms)
			break;
		default:
			reportError(res, NoResourceError); 
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
		case "/makeStudy":
		case "makeStudy": 
			extractJSON(req)
				.then(validatedData => jsonResponse(res, createStudy(validatedData)))
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
					broadcastMsgSSE(req, res, validatedData)
					.then(returnData => createMessage(returnData))
					.catch(err => reportError(res, err));
				}).catch(err => reportError(res, err));
		break;
		default: 
			console.error("Resource doesn't exist");
			reportError(res, NoResourceError); 
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
		case "/showAllTable": // NOT GOOD
		case "showAllTable":  // SLET det her
			showAllTableContent(res);
		break;
		case "/creategroups":
		case "creategroups": 
			makeFriends()
		break;
		case "/createAllNewUsers":
		case "createAllNewUsers": 
			createAllNewUsers()
		break;
		default: //For anything else we assume it is a file to be served
			fileResponse(res, req.url);
		break;
	}
}








function startCountDown() {
    let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours("16");
    tomorrow.setMinutes("00");
    let countDownDate = new Date(tomorrow).getTime();
    setTime(countDownDate);

    // Update the count down every 1 second
    let x = setInterval(function() {
        setTime(countDownDate);
    }, 1000);

    function setTime(countDownDate) {
        let now = new Date().getTime();
        
        // Find the distance between now and the count down date
        let distance = countDownDate - now;

		if(distance = 0){
			makeFriends()
		}
    }
}