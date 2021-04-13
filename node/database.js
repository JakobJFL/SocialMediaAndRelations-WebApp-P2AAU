export {login, createUser, createGroup, createMessage, showAllTableContent, getGroups, getChats, getGroupMembers, createInterest};

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
			    DBConnection.query("SELECT user_id FROM users WHERE mail = " + 
                    mysql.escape(loginData.email) + " AND psw = " + 
                    mysql.escape(loginData.password) , function (err, result, fields) {    
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

function getGroups(userId) {
	const DBConnection = dbConnect();
	return new Promise((resolve,reject) => {
		DBConnection.connect(function(err) {
			if (err) 
                reject(err)
			DBConnection.query("SELECT group_id FROM chatGroups WHERE member_id1 = " + 
				mysql.escape(userId) + " OR member_id2 = " + 
				mysql.escape(userId) + " OR member_id3 = " + 
				mysql.escape(userId) + " OR member_id4 = " + 
				mysql.escape(userId) + " OR member_id5 = " + 
				mysql.escape(userId) , function (err, result, fields) {    
					if(err) 
						reject(err) 
					else 
						resolve(result);
			});
		});
	});
}

function getGroupMembers(groupId) {
	const DBConnection = dbConnect();
	return new Promise((resolve,reject) => {
		DBConnection.connect(function(err) {
			if (err) 
                reject(err)
			DBConnection.query("SELECT member_id1, member_id2, member_id3, member_id4, member_id5 FROM chatGroups WHERE group_id = " + 
				mysql.escape(groupId), function (err, result, fields) {    
					if(err) 
						reject(err) 
					else 
						resolve(result);
			});
		});
	});
}

function getChats(groupId) {
	const DBConnection = dbConnect();
	return new Promise((resolve,reject) => {
		DBConnection.connect(function(err) {
			if (err) 
                reject(err)
			DBConnection.query("SELECT messages.msg_content,messages.user_ID,messages.TIMESTAMP, users.fname FROM messages INNER JOIN users ON messages.user_ID=users.user_id WHERE group_ID = " + 
				mysql.escape(groupId), function (err, result, fields) {   
					if(err) 
						reject(err) 
					else 
						resolve(result);
			});
		});
	});
}

function createUser(body) {
	const DBConnection = dbConnect();
	DBConnection.connect(function(err) {
		if (err) throw err;
		let sql = `INSERT INTO users(
			psw, 
			fname, 
			lname, 
			mail, 
			intrest1, 
			intrest2, 
			intrest3, 
			intrest4,
			CHG_TIMESTAMP) VALUES (
			${mysql.escape(body.psw)},
			${mysql.escape(body.fname)},
			${mysql.escape(body.lname)},
			${mysql.escape(body.mail)},
			${mysql.escape(body.intrest1)},
			${mysql.escape(body.intrest2)},
			${mysql.escape(body.intrest3)},
			${mysql.escape(body.intrest4)},
			'2021-03-26 15:03:10.000000');`;
		DBConnection.query(sql, function (err, result) {
		if (err) throw err;
		});
	});
 return body;
}

function createInterest(body) {
	const DBConnection = dbConnect();
	DBConnection.connect(function(err) {
		if (err) throw err;
		let sql = `INSERT INTO interests(
			name, 
			x, 
			y) VALUES (
			${mysql.escape(body.name)},
			${mysql.escape(body.x)},
			${mysql.escape(body.y)});`;
		DBConnection.query(sql, function (err, result) {
		if (err) throw err;
		});
	});
 return body;
}

function createGroup(body) {
	const DBConnection = dbConnect();
	DBConnection.connect(function(err) {
		if (err) throw err;
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
		if (err) throw err;
		});
	});
	return body;
}

function createMessage(body) {
	const DBConnection = dbConnect();
	DBConnection.connect(function(err) {
		if (err) throw err;
		let sql = `INSERT INTO messages(
			group_id, 
			user_id, 
			msg_content) VALUES (
			${mysql.escape(body.group_id)}, 
			${mysql.escape(body.user_id)}, 
			${mysql.escape(body.msg_content)});`;
		DBConnection.query(sql, function (err, result) {
		if (err) throw err;
		});
	});
	return body;
}

async function showAllTableContent(res) {
	let content = [];
	content.push(await getdata("interests"));
	content.push(await getdata("users"));
	content.push(await getdata("chatGroups"));
	content.push(await getdata("messages"));
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

