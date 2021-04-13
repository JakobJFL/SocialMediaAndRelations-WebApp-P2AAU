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
    
    var sql = "DROP TABLE `messages`"; 
    con.query(sql, function (err, result) { 
      if (err) throw err; 
      console.log("messages DELETED"); 
    }); 

    var sql = "DROP TABLE `chatGroups`"; 
    con.query(sql, function (err, result) { 
      if (err) throw err; 
      console.log("chatGroups DELETED"); 
      
    });

    var sql = "DROP TABLE `users`"; 
    con.query(sql, function (err, result) { 
      if (err) throw err; 
      console.log("users DELETED"); 
    }); 
    
    var sql = "DROP TABLE `interests`"; 
    con.query(sql, function (err, result) { 
      if (err) throw err; 
      console.log("interests DELETED"); 
    }); 
    
  }); 
