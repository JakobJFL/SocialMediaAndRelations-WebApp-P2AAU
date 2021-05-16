export {login, createUser, createGroup, createMessage, getGroups, getChats, getGroupMembers, getUserEmail, getAllUserId, getAllGroups, deleteGroup, getLastMessage};
import {ValidationError} from "./errors.js";
import {groupSize} from "./app.js";

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
			let sql = "SELECT chatGroups.group_id, "

			for (let i = 1; i <= groupSize; i++) 
				sql += "u"+i+".fname AS u"+i+", ";
			for (let i = 1; i <= groupSize; i++) 
				if (i === groupSize)
					sql += "s"+i+".name AS s"+i;
				else
					sql += "s"+i+".name AS s"+i+", ";

			sql += " FROM chatGroups ";
			for (let i = 1; i <= groupSize; i++) 
				sql += "LEFT JOIN users u"+i+" ON chatGroups.member_id"+i+"=u"+i+".user_id ";
			for (let i = 1; i <= groupSize; i++) 
				sql += "INNER JOIN studys s"+i+" ON u"+i+".study=s"+i+".study_id ";

			sql += "WHERE "
			for (let i = 1; i <= groupSize; i++) {
				if (i === 1)
					sql += "chatGroups.member_id"+i+" = " + mysql.escape(userID);
				else 
					sql += " OR chatGroups.member_id"+i+" = " + mysql.escape(userID);
			}

			DBConnection.query(sql, function (err, result, fields) {    
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
			let sql = "SELECT ";
			for (let i = 1; i <= groupSize; i++) {
				if (i === 1)
					sql += "member_id"+i;
				else 
					sql += ", member_id"+i;
			}

			DBConnection.query(sql + " FROM chatGroups WHERE group_id = " + 
				mysql.escape(groupID), function (err, result, fields) {    
					if(err) 
						reject(err) 
					else {
						resolve(result[0]); // Resolve first in array - There should only be one
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
			DBConnection.query("SELECT * FROM (SELECT messages.group_id, messages.user_ID, messages.msg_content, " +
				"messages.message_id, messages.TIMESTAMP, users.fname, users.lname FROM messages "+ 
				"INNER JOIN users ON messages.user_ID=users.user_id WHERE group_id = " +
				mysql.escape(groupID) + " ORDER BY message_id DESC LIMIT 100) sub ORDER BY message_id ASC;", function (err, result, fields) {   
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
			DBConnection.query("SELECT user_id, study FROM users WHERE state = '1' ORDER BY study ASC",
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
			let sql = "SELECT ";
			for (let i = 1; i <= groupSize; i++) {
				if (i === 1)
					sql += "chatGroups.member_id"+i;
				else 
					sql += ", chatGroups.member_id"+i;
			}
			DBConnection.query(sql + ", chatGroups.TIMESTAMP AS gTime, MAX(messages.TIMESTAMP) AS mTime, chatGroups.group_id FROM chatGroups " +
			"LEFT JOIN messages ON chatGroups.group_id=messages.group_ID GROUP BY chatGroups.group_id",
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

function getLastMessage(groupID) {
	const DBConnection = dbConnect();
	return new Promise((resolve,reject) => {
		DBConnection.connect(function(err){
			if (err) 
                reject(err)
			DBConnection.query("SELECT TIMESTAMP FROM messages WHERE group_ID = " + mysql.escape(groupID) + " ORDER BY message_id DESC LIMIT 1",
			function (err, result, fields) {   
				if(err) 
					reject(err) 
				else {
					resolve(result[0]);
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
			let sql = `INSERT INTO users(psw, fname, lname, mail, birthDate, study) VALUES (
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

function createGroup(body) {
	const DBConnection = dbConnect();
	return new Promise((resolve,reject) => {
		DBConnection.connect(function(err) {
			if (err) 
				reject(err);
			let sql = `INSERT INTO chatGroups(member_id1, member_id2, member_id3, member_id4, member_id5) VALUES (
				${mysql.escape(body.member_id1)}, 
				${mysql.escape(body.member_id2)}, 
				${mysql.escape(body.member_id3)}, 
				${mysql.escape(body.member_id4)},
				${mysql.escape(body.member_id5)});`;
			DBConnection.query(sql, function (err, result) {
				if (err) 
					reject(err);
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
			let sql = `INSERT INTO messages(group_id, user_id, msg_content) VALUES (
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

function deleteGroup(groupID) {
	const DBConnection = dbConnect();
	DBConnection.connect(function(err){
		if (err) 
			console.error(err);
		DBConnection.query("DELETE FROM chatGroups WHERE group_id = " + mysql.escape(groupID),
		function (err, result, fields) {   
			if(err) 
				console.error(err);
			else {
				DBConnection.end();
			}
		});
	});
}
