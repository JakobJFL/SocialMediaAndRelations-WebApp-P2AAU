/*
USERS:
id
psw
fname
lname
mail
REG_TIMESTAMP
CHG_TIMESTAMP
state
*/

/*
GROUPS:
id
member_id1
member_id2
member_id3
member_id4
member_id5
TIMESTAMP
*/

/*messages
MESSAGES:
msg_id
group_id
user_id
msg_content
TIMESTAMP
*/

/*interests
interests:
id
name
*/
/*
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

  let sql = "CREATE TABLE `interests`(`interest_id` int(11) NOT NULL PRIMARY KEY,`name` varchar(50) NOT NULL,`x` int(11) NOT NULL,`y` int(11) NOT NULL);"

  con.query(sql, function (err, result) { 
    if (err) throw err; 
    console.log("users created"); 
  });
});

/*
CREATE TABLE `interests`(
	`interest_id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`name` varchar(50) NOT NULL,
	`x` int(11) NOT NULL,
	`y` int(11) NOT NULL
);
CREATE TABLE `users` ( 
	`user_id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`psw` varchar(50) NOT NULL,
	`fname` varchar(50) NOT NULL,
	`lname` varchar(50) NOT NULL,
	`mail` varchar(50) NOT NULL,
	`intrest1` int(11),
	`intrest2` int(11),
	`intrest3` int(11),
	`intrest4` int(11),
	`REG_TIMESTAMP` timestamp NOT NULL DEFAULT current_timestamp(),
	`CHG_TIMESTAMP` datetime,
	`state` int(11) NOT NULL DEFAULT 1,
	 FOREIGN KEY(intrest1) REFERENCES interests(interest_id) ON DELETE SET NULL,
	 FOREIGN KEY(intrest2) REFERENCES interests(interest_id) ON DELETE SET NULL,
	 FOREIGN KEY(intrest3) REFERENCES interests(interest_id) ON DELETE SET NULL,
	 FOREIGN KEY(intrest4) REFERENCES interests(interest_id) ON DELETE SET NULL
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
	`user_id` int(11),
	`group_id` int(11),
	`msg_content` varchar(2001) NOT NULL,
	`TIMESTAMP` timestamp NOT NULL DEFAULT current_timestamp(),
	FOREIGN KEY(group_id) REFERENCES chatGroups(group_id) ON DELETE SET NULL,
	FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE SET NULL
);
*/



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
    let sql = "CREATE TABLE `interests`(`interest_id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,`name` varchar(50) NOT NULL,`x` int(11) NOT NULL,`y` int(11) NOT NULL);"; 
    con.query(sql, function (err, result) { 
      if (err) throw err; 
      console.log("interests created"); 
    }); 

    console.log("Database Connected"); 
    sql = "CREATE TABLE `users` ( `user_id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,`psw` varchar(50) NOT NULL,`fname` varchar(50) NOT NULL, `lname` varchar(50) NOT NULL,`mail` varchar(50) NOT NULL, `intrest1` int(11),`intrest2` int(11),`intrest3` int(11), `intrest4` int(11),`REG_TIMESTAMP` timestamp NOT NULL DEFAULT current_timestamp(),`CHG_TIMESTAMP` datetime,`state` int(11) NOT NULL DEFAULT 1, FOREIGN KEY(intrest1) REFERENCES interests(interest_id) ON DELETE SET NULL, FOREIGN KEY(intrest2) REFERENCES interests(interest_id) ON DELETE SET NULL, FOREIGN KEY(intrest3) REFERENCES interests(interest_id) ON DELETE SET NULL, FOREIGN KEY(intrest4) REFERENCES interests(interest_id) ON DELETE SET NULL);"; 
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
  sql = "ALTER TABLE Sales.TempSalesReason ADD CONSTRAINT FK_TempSales_SalesReason FOREIGN KEY (TempID) REFERENCES Sales.SalesReason (SalesReasonID) ON DELETE CASCADEON UPDATE CASCADE;"; 
  con.query(sql, function (err, result) { 
    if (err) throw err; 
  }); 

/*
con.connect(function(err) { 
    if (err) throw err; 
    console.log("Connected!"); 
    //let sql = "CREATE TABLE `users` ( `user_id` int(11) NOT NULL, `user_psw` varchar(50) NOT NULL, `user_name` varchar(50) NOT NULL, `user_lname` varchar(50) NOT NULL, `user_mail` varchar(50) NOT NULL, `user_intrest1` int(11) NOT NULL,`user_intrest2` int(11) NOT NULL,`user_intrest3` int(11) NOT NULL,`REG_TIMESTAMP` timestamp NOT NULL DEFAULT current_timestamp(),`CHG_TIMESTAMP` datetime NOT NULL, `user_state` int(11) NOT NULL DEFAULT 1) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;  "; 
    let sql = "CREATE TABLE `message` ( `msg_id` int(11) NOT NULL, `group_id` int(11) NOT NULL, `user_id` int(11) NOT NULL, `msg_content` varchar(1000) NOT NULL `TIMESTAMP` timestamp NOT NULL DEFAULT current_timestamp(), `msg_state` int(11) NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4; "; 
    //let sql = "CREATE TABLE `groups` (`group_id` int(11) NOT NULL,`group_member_id1` int(11) NOT NULL,`group_member_id2` int(11) NOT NULL,`group_member_id3` int(11) NOT NULL,`group_member_id4` int(11) NOT NULL,`TIMESTAMP` timestamp NOT NULL DEFAULT current_timestamp(),`group_state` int(11) NOT NULL DEFAULT 1) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;"; 
    con.query(sql, function (err, result) { 
      if (err) throw err; 
      console.log("groups created"); 
    }); 
  }); 

  con.connect(function(err) { 
    if (err) throw err; 
    console.log("Connected!"); 
    //let sql = "CREATE TABLE `users` ( `user_id` int(11) NOT NULL, `user_psw` varchar(50) NOT NULL, `user_name` varchar(50) NOT NULL, `user_lname` varchar(50) NOT NULL, `user_mail` varchar(50) NOT NULL, `user_intrest1` int(11) NOT NULL,`user_intrest2` int(11) NOT NULL,`user_intrest3` int(11) NOT NULL,`REG_TIMESTAMP` timestamp NOT NULL DEFAULT current_timestamp(),`CHG_TIMESTAMP` datetime NOT NULL, `user_state` int(11) NOT NULL DEFAULT 1) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;  "; 
    //let sql = "CREATE TABLE `message` ( `msg_id` int(11) NOT NULL, `group_id` int(11) NOT NULL, `user_id` int(11) NOT NULL, `msg_content` varchar(1000) NOT NULL `TIMESTAMP` timestamp NOT NULL DEFAULT current_timestamp(), `msg_state` int(11) NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4; "; 
    let sql = "CREATE TABLE `groups` (`group_id` int(11) NOT NULL,`group_member_id1` int(11) NOT NULL,`group_member_id2` int(11) NOT NULL,`group_member_id3` int(11) NOT NULL,`group_member_id4` int(11) NOT NULL,`TIMESTAMP` timestamp NOT NULL DEFAULT current_timestamp(),`group_state` int(11) NOT NULL DEFAULT 1) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;"; 
    con.query(sql, function (err, result) { 
      if (err) throw err; 
      console.log("groups created"); 
    }); 
  }); 
*/





/*

CREATE TABLE `interests`(`id` int(11) NOT NULL PRIMARY KEY,`name` varchar(50) NOT NULL,`x` int(11) NOT NULL,`y` int(11) NOT NULL);

CREATE TABLE `users` ( `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,`psw` varchar(50) NOT NULL,`fname` varchar(50) NOT NULL, `lname` varchar(50) NOT NULL,`mail` varchar(50) NOT NULL, `intrest1` int(11),`intrest2` int(11),`intrest3` int(11), `intrest4` int(11),`REG_TIMESTAMP` timestamp NOT NULL DEFAULT current_timestamp(),`CHG_TIMESTAMP` datetime,`state` int(11) NOT NULL DEFAULT 1,FOREIGN KEY(intrest1) REFERENCES interests(id) ON DELETE SET NULL,FOREIGN KEY(intrest2) REFERENCES interests(id) ON DELETE SET NULL,FOREIGN KEY(intrest3) REFERENCES interests(id) ON DELETE SET NULL,FOREIGN KEY(intrest4) REFERENCES interests(id) ON DELETE SET NULL);

CREATE TABLE `groups`(`id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,`member_id1` int(11),`member_id2` int(11),`member_id3` int(11),`member_id4` int(11),`member_id5` int(11),`TIMESTAMP` timestamp NOT NULL DEFAULT current_timestamp(),FOREIGN KEY(member_id1) REFERENCES users(id) ON DELETE SET NULL,FOREIGN KEY(member_id2) REFERENCES users(id) ON DELETE SET NULL,FOREIGN KEY(member_id3) REFERENCES users(id) ON DELETE SET NULL, FOREIGN KEY(member_id4) REFERENCES users(id) ON DELETE SET NULL,FOREIGN KEY(member_id5) REFERENCES users(id) ON DELETE SET NULL);

CREATE TABLE `messages` (`id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,`group_id` int(11),`user_id` int(11),`msg_content` varchar(2001) NOT NULL,`TIMESTAMP` timestamp NOT NULL DEFAULT current_timestamp(),FOREIGN KEY(group_id) REFERENCES groups(id) ON DELETE SET NULL,FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL);
*/