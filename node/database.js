export {login, createUser, createGroup, createMessage, showAllTableContent, getGroups, getChats, getGroupMembers, createStudy, getUserEmail,getAllUserId,getAllGroups};
import {ValidationError} from "./errors.js";

import mysql from "mysql";
//const mysql = require('mysql');
//you may need to: npm install mysql

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
			    DBConnection.query("SELECT user_id, fname, lname FROM users WHERE mail = " + 
                    mysql.escape(loginData.email) + " AND psw = " + 
                    mysql.escape(loginData.password) , function (err, result, fields) {    
				if(err) {
					reject(err) 
				} 
				else {
					resolve(result);
					DBConnection.end();
				} 
			});
		});
	});
}

function getGroups(userID) {
	const DBConnection = dbConnect();
	return new Promise((resolve,reject) => {
		DBConnection.connect(function(err) {
			if (err) 
                reject(err)
			DBConnection.query("SELECT chatGroups.group_id, u1.fname AS u1, u2.fname AS u2, u3.fname AS u3, u4.fname AS u4, u5.fname AS u5 FROM chatGroups " + 
			"INNER JOIN users u1 ON chatGroups.member_id1=u1.user_id " +
			"INNER JOIN users u2 ON chatGroups.member_id2=u2.user_id " +
			"INNER JOIN users u3 ON chatGroups.member_id3=u3.user_id " +
			"INNER JOIN users u4 ON chatGroups.member_id4=u4.user_id " +
			"INNER JOIN users u5 ON chatGroups.member_id5=u5.user_id " +
			"WHERE member_id1 = " + 
				mysql.escape(userID) + " OR member_id2 = " + 
				mysql.escape(userID) + " OR member_id3 = " + 
				mysql.escape(userID) + " OR member_id4 = " + 
				mysql.escape(userID) + " OR member_id5 = " + 
				mysql.escape(userID) , function (err, result, fields) {    
					if(err) 
						reject(err) 
					else {
						resolve(result);
						DBConnection.end();
					}
			});
		});
	});
}

function getGroupMembers(groupID) {
	const DBConnection = dbConnect();
	return new Promise((resolve,reject) => {
		DBConnection.connect(function(err) {
			if (err) 
                reject(err)
			DBConnection.query("SELECT member_id1, member_id2, member_id3, member_id4, member_id5 FROM chatGroups WHERE group_id = " + 
				mysql.escape(groupID), function (err, result, fields) {    
					if(err) 
						reject(err) 
					else {
						resolve(result);
						DBConnection.end();
					}
			});
		});
	});
}

function getChats(groupID) {
	const DBConnection = dbConnect();
	return new Promise((resolve,reject) => {
		DBConnection.connect(function(err) {
			if (err) 
                reject(err)
			DBConnection.query("SELECT * FROM (SELECT messages.group_id, messages.user_ID, messages.msg_content, messages.message_id, messages.TIMESTAMP, users.fname, users.lname FROM messages INNER JOIN users ON messages.user_ID=users.user_id WHERE group_id = " 
			+ mysql.escape(groupID) + " ORDER BY message_id DESC LIMIT 100) sub ORDER BY message_id ASC;", function (err, result, fields) {   
				if(err) 
					reject(err) 
				else {
					resolve(result);
					DBConnection.end();
				}
			});
		});
	});
}

function createUser(body) {
	const DBConnection = dbConnect();
	return new Promise((resolve,reject) => {
		DBConnection.connect(function(err) {
			if (err) 
				reject(err);
			let sql = `INSERT INTO users(
				psw, 
				fname, 
				lname, 
				mail, 
				birthDate, 
				study) VALUES (
				${mysql.escape(body.psw)},
				${mysql.escape(body.fname)},
				${mysql.escape(body.lname)},
				${mysql.escape(body.mail)},
				${mysql.escape(body.birthDate)},
				${mysql.escape(body.study)});`;

			DBConnection.query(sql, function (err, result) {
				if (err) 
					reject(new Error(ValidationError));
				resolve(result);
			});
			DBConnection.end();
		});
	});
}

function getUserEmail(mail) {
	const DBConnection = dbConnect();
	return new Promise((resolve,reject) => {
		DBConnection.connect(function(err) {
			if (err) 
				reject(err)
			DBConnection.query("SELECT mail FROM users WHERE mail = " + 
				mysql.escape(mail), function (err, result, fields) {   
				if(err) 
					reject(err) 
				else {
					resolve(result);
					DBConnection.end();
				}
			});
		});
	});
}

function getAllUserId() {
	const DBConnection = dbConnect();
	return new Promise((resolve,reject) => {
		DBConnection.connect(function(err){
			if (err) 
                reject(err)
			DBConnection.query("SELECT user_id FROM users WHERE state = '1' ORDER BY user_id ASC",
			function (err, result, fields) {   
				if(err) 
					reject(err) 
				else {
					resolve(result);
					DBConnection.end();
				}
			});
		});
	});
}

function getAllGroups() {
	const DBConnection = dbConnect();
	return new Promise((resolve,reject) => {
		DBConnection.connect(function(err){
			if (err) 
                reject(err)
			DBConnection.query("SELECT * FROM chatGroups",
			function (err, result, fields) {   
				if(err) 
					reject(err) 
				else {
					resolve(result);
					DBConnection.end();
				}
			});
		});
	});
}

function createStudy(body) {
	const DBConnection = dbConnect();
	DBConnection.connect(function(err) {
		if (err) throw err;
		let sql = `INSERT INTO studys(
			name, 
			priority) VALUES (
			${mysql.escape(body.name)},
			${mysql.escape(body.priority)});`;
		DBConnection.query(sql, function (err, result) {
		if (err) throw err;
		});
		DBConnection.end();
	});
 return body;
}

function createGroup(body) {
	const DBConnection = dbConnect();
	return new Promise((resolve,reject) => {
		DBConnection.connect(function(err) {
			if (err) 
				reject(err);
			let sql = `INSERT INTO chatGroups(
				member_id1, 
				member_id2, 
				member_id3, 
				member_id4,
				member_id5) VALUES (
				${mysql.escape(body.member_id1)}, 
				${mysql.escape(body.member_id2)}, 
				${mysql.escape(body.member_id3)}, 
				${mysql.escape(body.member_id4)},
				${mysql.escape(body.member_id5)});`;
			DBConnection.query(sql, function (err, result) {
				if (err) 
					reject(new Error(ValidationError));
				resolve(result)
			});
			DBConnection.end();
		});
	});
}

function createMessage(body) {
	const DBConnection = dbConnect();
	return new Promise((resolve,reject) => {
		DBConnection.connect(function(err) {
			if (err) 
				reject(err);
			let sql = `INSERT INTO messages(
				group_id, 
				user_id, 
				msg_content) VALUES (
				${mysql.escape(body.group_id)}, 
				${mysql.escape(body.user_id)}, 
				${mysql.escape(body.msg_content)});`;
			DBConnection.query(sql, function (err, result) {
				if (err) 
					reject(new Error(ValidationError));
				resolve(result);
			});
			DBConnection.end();
		});
	});
}

async function showAllTableContent(res) {
	let content = [];
	content.push(await getdata("studys"));
	content.push(await getdata("users"));
	content.push(await getdata("chatGroups"));
	//content.push(await getdata("messages"));
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
				DBConnection.end();
			});
		});
	});
}

