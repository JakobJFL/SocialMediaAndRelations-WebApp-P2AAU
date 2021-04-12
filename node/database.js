export {login, createUser, createGroup, createMessage, showAllTableContent, getGroups};

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
			    DBConnection.query("SELECT user_id FROM users WHERE user_mail = " + 
                    mysql.escape(loginData.email) + " AND user_psw = " + 
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
			if (err) {
                reject(err)
            };
			    DBConnection.query("SELECT group_id FROM groups WHERE group_member_id1 = " + 
                    mysql.escape(userId) + " OR group_member_id2 = " + 
                    mysql.escape(userId) + " OR group_member_id3 = " + 
					mysql.escape(userId) + " OR group_member_id4 = " + 
                    mysql.escape(userId) , function (err, result, fields) {    
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
				//console.table(result);
				resolve(result);
			});
		});
	});
}

