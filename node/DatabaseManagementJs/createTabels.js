import mysql from "mysql";
 
var con = mysql.createConnection({ 
  host: "localhost", 
  user: "sw2c2-19", 
  password: "VCp2rR3zG6msejsZ", 
  database: "sw2c2_19" 
});

con.connect(function(err) { 
	if (err) throw err;
	console.log("Database Connected"); 
/*
	let sql = "CREATE TABLE `studys`(`study_id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,`name` varchar(30) NOT NULL,`priority` int(11) NOT NULL);"; 
	con.query(sql, function (err, result) { 
		if (err) throw err; 
		console.log("studys created"); 
	}); 
*/
	let sql = "CREATE TABLE `users` ( `user_id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,`psw` varchar(50) NOT NULL,`fname` varchar(50) NOT NULL, `lname` varchar(50) NOT NULL,`mail` varchar(50) NOT NULL,`study` int(11),`birthDate` date NOT NULL,`bio` varchar(300),`REG_TIMESTAMP` timestamp NOT NULL DEFAULT current_timestamp(),`CHG_TIMESTAMP` datetime,`state` int(11) NOT NULL DEFAULT 1, FOREIGN KEY(study) REFERENCES studys(study_id) ON DELETE SET NULL);"; 
	con.query(sql, function (err, result) { 
		if (err) throw err; 
		console.log("users created"); 
	}); 

	sql = "CREATE TABLE `chatGroups` (`group_id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,`member_id1` int(11),`member_id2` int(11),`member_id3` int(11),`member_id4` int(11),`member_id5` int(11),`TIMESTAMP` timestamp NOT NULL DEFAULT current_timestamp(),FOREIGN KEY(member_id1) REFERENCES users(user_id) ON DELETE SET NULL,FOREIGN KEY(member_id2) REFERENCES users(user_id) ON DELETE SET NULL,FOREIGN KEY(member_id3) REFERENCES users(user_id) ON DELETE SET NULL,FOREIGN KEY(member_id4) REFERENCES users(user_id) ON DELETE SET NULL,FOREIGN KEY(member_id5) REFERENCES users(user_id) ON DELETE SET NULL);"; 
	con.query(sql, function (err, result) { 
		if (err) throw err; 
		console.log("chatGroups created"); 
	}); 

	sql = "CREATE TABLE `messages` (`message_id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,`group_ID` int(11),`user_ID` int(11),`msg_content` varchar(2001) NOT NULL,`TIMESTAMP` timestamp NOT NULL DEFAULT current_timestamp(),FOREIGN KEY(group_ID) REFERENCES chatGroups(group_id) ON DELETE SET NULL,FOREIGN KEY(user_ID) REFERENCES users(user_id) ON DELETE SET NULL);"; 
	con.query(sql, function (err, result) { 
		console.log(result); 
		if (err) throw err; 
		console.log("messages created"); 
	}); 
});

/*
CREATE TABLE `studys`(
	`study_id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`name` varchar(30) NOT NULL,
	`priority` int(11) NOT NULL
);

CREATE TABLE `users` (
	`user_id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`psw` varchar(50) NOT NULL,
	`fname` varchar(50) NOT NULL,
	`lname` varchar(50) NOT NULL,
	`mail` varchar(50) NOT NULL,
	`study` int(11),
	`birthDate` date NOT NULL,
	`bio` varchar(300),
	`REG_TIMESTAMP` timestamp NOT NULL DEFAULT current_timestamp(),
	`CHG_TIMESTAMP` datetime,
	`state` int(11) NOT NULL DEFAULT 1,
	FOREIGN KEY(study) REFERENCES studys(study_id) ON DELETE SET NULL
);

CREATE TABLE `chatGroups` (
	`group_id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`member_id1` int(11),
	`member_id2` int(11),
	`member_id3` int(11),
	`member_id4` int(11),
	`member_id5` int(11),
	`TIMESTAMP` timestamp NOT NULL DEFAULT current_timestamp(),
	FOREIGN KEY(member_id1) REFERENCES users(user_id) ON DELETE SET NULL,
	FOREIGN KEY(member_id2) REFERENCES users(user_id) ON DELETE SET NULL,
	FOREIGN KEY(member_id3) REFERENCES users(user_id) ON DELETE SET NULL,
	FOREIGN KEY(member_id4) REFERENCES users(user_id) ON DELETE SET NULL,
	FOREIGN KEY(member_id5) REFERENCES users(user_id) ON DELETE SET NULL
);

CREATE TABLE `messages` (
	`message_id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`group_ID` int(11),
	`user_ID` int(11),
	`msg_content` varchar(2001) NOT NULL,
	`TIMESTAMP` timestamp NOT NULL DEFAULT current_timestamp(),
	FOREIGN KEY(group_ID) REFERENCES chatGroups(group_id) ON DELETE SET NULL,
	FOREIGN KEY(user_ID) REFERENCES users(user_id) ON DELETE SET NULL
);
*/