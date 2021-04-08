//We use EC6 modules!
import {extractJSON, fileResponse, htmlResponse, responseAuth, jsonResponse, reportError, startServer} from "./server.js";
import {printChatPage} from "./siteChat.js";
import {printLoginPage} from "./siteLogin.js";

const ValidationError="Validation Error";
const NoResourceError="No Such Resource";
export {ValidationError, NoResourceError, processReq, login};
import mysql from "mysql";
//you may need to: npm install mysql
startServer();

//test DB connection 

//const mysql = require('mysql');

//constants for validating input from the network client
const minLoginLength=1;
const maxLoginLength=50;

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

//function that validates the constraints of the BMIData object
//bmiData must contain valid name,height,weight attributes

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
	// Validates user ID
	/*
	if (userData.user_id === parseInt(userData.user_id,10)) {
        return userData;
	}  else {
        console.log("User ID is not valid")
    }
	*/
	return userData;
}



function validateGroupData(groupData) {
	// Validates group ID
	if (groupData.group_id === parseInt(groupData.group_id,10)){
		return groupData;
	}  	else {
  		console.log("Data is not an integer")
	}		
}

const content_limit = 200;

function validateMessageData(messageData) {
	// Character limit in chatbox 
	if (messageData.msg_content.length <= content_limit) {
        return messageData;
    }	else {
        	console.log("Message content is too long")
    	}
	}

/* *********************************************************************
   Setup HTTP route handling: Called when a HTTP request is received 
   ******************************************************************** */
function processReq(req,res){
	//console.log("GOT: " + req.method + " " +req.url);
	let baseURL = 'http://' + req.headers.host + '/';    //https://github.com/nodejs/node/issues/12682
	let url=new URL(req.url,baseURL);
	let searchParms=new URLSearchParams(url.search);
	let queryPath=decodeURIComponent(url.pathname); //Convert uri encoded special letters (eg æøå that is escaped by "%number") to JS string

	switch(req.method){
		case "POST": {
		let pathElements=queryPath.split("/"); 
		console.log(pathElements[1]);
		switch(pathElements[1]){
			case "/login":
			case "login": 
				extractJSON(req)
					.then(loginData => validateLoginData(loginData))
					.then(validLoginData => jsonResponse(res, login(validLoginData)))
					.catch(err=>reportError(res,err));
			break;
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
				case "chatHack": 
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

function dbConnect() {
	return mysql.createConnection({ 
		host: "localhost", 
		user: "sw2c2-19", 
		password: "VCp2rR3zG6msejsZ", 
		database: "sw2c2_19" 
	});
}

function login(loginData) {
	const DBConnection = dbConnect();
	return new Promise((resolve,reject) => {
		DBConnection.connect(function(err) {
			if (err) reject(err);
			DBConnection.query("SELECT user_id FROM users WHERE user_mail = " + mysql.escape(loginData.email) + " AND user_psw = " + mysql.escape(loginData.password) , function (err, result, fields) {    
				if(err) {
					reject(err) 
				} 
				else {
					resolve(result);
				} 
			});
		});
	});
}

function createUser(body) {
	const DBConnection = dbConnect();
	DBConnection.connect(function(err) {
		if (err) throw err;
		console.log("Connected!");
		let sql = `INSERT INTO users(
			user_psw, 
			user_name, 
			user_lname, 
			user_mail, 
			user_intrest1, 
			user_intrest2, 
			user_intrest3, 
			CHG_TIMESTAMP) VALUES (
			${mysql.escape(body.user_psw)},
			${mysql.escape(body.user_name)},
			${mysql.escape(body.user_lname)},
			${mysql.escape(body.user_mail)},
			${mysql.escape(body.user_intrest1)},
			${mysql.escape(body.user_intrest2)},
			${mysql.escape(body.user_intrest3)},
			'2021-03-26 15:03:10.000000');`;
		console.log(sql)
		DBConnection.query(sql, function (err, result) {
		if (err) throw err;
		console.log("1 record inserted");
		});
	});
 return body;
}

function createGroup(body) {
	const DBConnection = dbConnect();
	DBConnection.connect(function(err) {
		if (err) throw err;
		console.log("Connected!");
		let sql = `INSERT INTO groups(
			group_member_id1, 
			group_member_id2, 
			group_member_id3, 
			group_member_id4) VALUES (
			${mysql.escape(body.group_member_id1)}, 
			${mysql.escape(body.group_member_id2)}, 
			${mysql.escape(body.group_member_id3)}, 
			${mysql.escape(body.group_member_id4)});`;
		console.log(sql)
		DBConnection.query(sql, function (err, result) {
		if (err) throw err;
		console.log("1 record inserted");
		});
	});
	return body;
}

function createMessage(body) {
	const DBConnection = dbConnect();
	DBConnection.connect(function(err) {
		if (err) throw err;
		console.log("Connected!");
		let sql = `INSERT INTO message(
			group_id, 
			user_id, 
			msg_state,
			msg_content) VALUES (
			${mysql.escape(body.group_id)}, 
			${mysql.escape(body.user_id)}, 
			${mysql.escape(1)}, 
			${mysql.escape(body.msg_content)});`;
		console.log(sql)
		DBConnection.query(sql, function (err, result) {
		if (err) throw err;
		console.log("1 record inserted");
		});
	});
	return body;
}

async function showAllTableContent(res) {
	let content = [];
	content.push(await getdata("users"));
	content.push(await getdata("groups"));
	content.push(await getdata("message"));
	//const groupsResult = await getdata("groups");
	jsonResponse(res, content);
}

function getdata(typeData) {
	const DBConnection = dbConnect();
	return new Promise((resolve,reject) => {
		DBConnection.connect(function(err) {
			if (err) reject(err);
			DBConnection.query("SELECT * FROM " + typeData, function (err, result, fields) {
				if (err) reject(err);
				console.table(result);
				resolve(result);
			});
		});
	});
}
