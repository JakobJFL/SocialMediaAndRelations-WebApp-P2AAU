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
var mysql = require('mysql'); 
 
var con = mysql.createConnection({ 
  host: "localhost", 
  user: "sw2c2-19", 
  password: "VCp2rR3zG6msejsZ", 
  database: "sw2c2_19" 
});

con.connect(function(err) { 
  if (err) throw err;
  console.log("Database Connected"); 

  let sql = "CREATE TABLE `interests`("
  sql +="`id` int(11) NOT NULL PRIMARY KEY,"
  sql +="`name` varchar(50) NOT NULL,"
  sql +="`x` int(11) NOT NULL,"
  sql +="`y` int(11) NOT NULL);"

  sql +="CREATE TABLE `users` (" 
  sql +="  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,"
  sql +="  `psw` varchar(50) NOT NULL,"
  sql +="  `fname` varchar(50) NOT NULL,"
  sql +="  `lname` varchar(50) NOT NULL,"
  sql +="  `mail` varchar(50) NOT NULL,"
  sql +="  `intrest1` int(11),"
  sql +="  `intrest2` int(11),"
  sql +="  `intrest3` int(11),"
  sql +="  `intrest4` int(11),"
  sql +="  `REG_TIMESTAMP` timestamp NOT NULL DEFAULT current_timestamp(),"
  sql +="  `CHG_TIMESTAMP` datetime,"
  sql +="  `state` int(11) NOT NULL DEFAULT 1,"
  sql +="  FOREIGN KEY(intrest1) REFERENCES interests(id) ON DELETE SET NULL,"
  sql +="  FOREIGN KEY(intrest2) REFERENCES interests(id) ON DELETE SET NULL,"
  sql +="  FOREIGN KEY(intrest3) REFERENCES interests(id) ON DELETE SET NULL,"
  sql +="  FOREIGN KEY(intrest4) REFERENCES interests(id) ON DELETE SET NULL);"

  sql +="CREATE TABLE `groups`("
  sql +="  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,"
  sql +="  `member_id1` int(11),"
  sql +="  `member_id2` int(11),"
  sql +="  `member_id3` int(11),"
  sql +="  `member_id4` int(11),"
  sql +="  `member_id5` int(11),"
  sql +="  `TIMESTAMP` timestamp NOT NULL DEFAULT current_timestamp(),"
  sql +="  FOREIGN KEY(member_id1) REFERENCES users(id) ON DELETE SET NULL,"
  sql +="  FOREIGN KEY(member_id2) REFERENCES users(id) ON DELETE SET NULL,"
  sql +="  FOREIGN KEY(member_id3) REFERENCES users(id) ON DELETE SET NULL,"
  sql +="  FOREIGN KEY(member_id4) REFERENCES users(id) ON DELETE SET NULL,"
  sql +="  FOREIGN KEY(member_id5) REFERENCES users(id) ON DELETE SET NULL);"

  sql +="CREATE TABLE `messages` ("
  sql +="  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,"
  sql +="  `group_id` int(11),"
  sql +="  `user_id` int(11),"
  sql +="  `msg_content` varchar(2001) NOT NULL,"
  sql +="  `TIMESTAMP` timestamp NOT NULL DEFAULT current_timestamp(),"
  sql +="  FOREIGN KEY(group_id) REFERENCES groups(id) ON DELETE SET NULL,"
  sql +="  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL"
  sql +=");"

  con.query(sql, function (err, result) { 
    if (err) throw err; 
    console.log("users created"); 
  });
});





/*

CREATE TABLE `interests`(
  `id` int(11) NOT NULL PRIMARY KEY,
  `name` varchar(50) NOT NULL,
  `x` int(11) NOT NULL,
  `y` int(11) NOT NULL
);

CREATE TABLE `users` ( 
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
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
  FOREIGN KEY(intrest1) REFERENCES interests(id) ON DELETE SET NULL,
  FOREIGN KEY(intrest2) REFERENCES interests(id) ON DELETE SET NULL,
  FOREIGN KEY(intrest3) REFERENCES interests(id) ON DELETE SET NULL,
  FOREIGN KEY(intrest4) REFERENCES interests(id) ON DELETE SET NULL
);

CREATE TABLE `groups`(
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `member_id1` int(11),
  `member_id2` int(11),
  `member_id3` int(11),
  `member_id4` int(11),
  `member_id5` int(11),
  `TIMESTAMP` timestamp NOT NULL DEFAULT current_timestamp(),
  FOREIGN KEY(member_id1) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY(member_id2) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY(member_id3) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY(member_id4) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY(member_id5) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE `messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `group_id` int(11),
  `user_id` int(11),
  `msg_content` varchar(2001) NOT NULL,
  `TIMESTAMP` timestamp NOT NULL DEFAULT current_timestamp(),
  FOREIGN KEY(group_id) REFERENCES groups(id) ON DELETE SET NULL,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL
);




*/

 

/*


var mysql = require('mysql'); 
 
var con = mysql.createConnection({ 
  host: "localhost", 
  user: "sw2c2-19", 
  password: "VCp2rR3zG6msejsZ", 
  database: "sw2c2_19" 
});

con.connect(function(err) { 
    if (err) throw err;

    console.log("Database Connected"); 
    let sql = "CREATE TABLE `users` ( `user_id` int(11) NOT NULL, `user_psw` varchar(50) NOT NULL, `user_name` varchar(50) NOT NULL, `user_lname` varchar(50) NOT NULL, `user_mail` varchar(50) NOT NULL, `user_intrest1` int(11) NOT NULL,`user_intrest2` int(11) NOT NULL,`user_intrest3` int(11) NOT NULL,`REG_TIMESTAMP` timestamp NOT NULL DEFAULT current_timestamp(),`CHG_TIMESTAMP` datetime NOT NULL, `user_state` int(11) NOT NULL DEFAULT 1) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;  "; 
    con.query(sql, function (err, result) { 
      if (err) throw err; 
      console.log("users created"); 
    }); 

    sql = "ALTER TABLE `users` ADD PRIMARY KEY (`user_id`);"; 
    con.query(sql, function (err, result) { 
      if (err) throw err; 
    }); 

    sql = "ALTER TABLE `users` MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT;"; 
    con.query(sql, function (err, result) { 
      if (err) throw err; 
    }); 

     sql = "CREATE TABLE `message` (`msg_id` int(11) NOT NULL, `group_id` int(11) NOT NULL, `user_id` int(11) NOT NULL,`msg_content` varchar(1001) NOT NULL,`TIMESTAMP` timestamp NOT NULL DEFAULT current_timestamp(),`msg_state` int(11) NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;"; 
    con.query(sql, function (err, result) { 
      if (err) throw err; 
      console.log("message created"); 
    }); 

    sql = "ALTER TABLE `message` ADD PRIMARY KEY (`msg_id`);"; 
    con.query(sql, function (err, result) { 
      if (err) throw err; 
    }); 

    sql = "ALTER TABLE `message` MODIFY `msg_id` int(11) NOT NULL AUTO_INCREMENT;"; 
    con.query(sql, function (err, result) { 
      if (err) throw err; 
    }); 

     sql = "CREATE TABLE `groups` (`group_id` int(11) NOT NULL,`group_member_id1` int(11) NOT NULL,`group_member_id2` int(11) NOT NULL,`group_member_id3` int(11) NOT NULL,`group_member_id4` int(11) NOT NULL,`TIMESTAMP` timestamp NOT NULL DEFAULT current_timestamp(),`group_state` int(11) NOT NULL DEFAULT 1) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;"; 
    con.query(sql, function (err, result) { 
      if (err) throw err; 
      console.log("groups created"); 
    }); 

    sql = "ALTER TABLE `groups` ADD PRIMARY KEY (`group_id`);"; 
    con.query(sql, function (err, result) { 
      if (err) throw err; 
    }); 

    sql = "ALTER TABLE `groups` MODIFY `group_id` int(11) NOT NULL AUTO_INCREMENT;"; 
    con.query(sql, function (err, result) { 
      if (err) throw err; 
    }); 

    Alter table [Transaction] add constraint Transaction_BankID_FK
    Foreign Key (BankID) references Banks(BankID)

    FOREIGN KEY (book_id) REFERENCES books(id)


  });


  sql = "ALTER TABLE Sales.TempSalesReason ADD CONSTRAINT FK_TempSales_SalesReason FOREIGN KEY (TempID) REFERENCES Sales.SalesReason (SalesReasonID) ON DELETE CASCADEON UPDATE CASCADE;"; 
  con.query(sql, function (err, result) { 
    if (err) throw err; 
  }); 





*/




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