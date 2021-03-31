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


     sql = "CREATE TABLE `message` (`msg_id` int(11) NOT NULL, `group_id` int(11) NOT NULL, `user_id` int(11) NOT NULL,`msg_content` varchar(1000) NOT NULL,`TIMESTAMP` timestamp NOT NULL DEFAULT current_timestamp(),`msg_state` int(11) NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;"; 
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