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
    var sql = "DROP TABLE `users`"; 
    con.query(sql, function (err, result) { 
      if (err) throw err; 
      console.log("users DELETED"); 
    }); 
 
    var sql = "DROP TABLE `message`"; 
    con.query(sql, function (err, result) { 
      if (err) throw err; 
      console.log("message DELETED"); 
    }); 

    var sql = "DROP TABLE `groups`"; 
    con.query(sql, function (err, result) { 
      if (err) throw err; 
      console.log("groups DELETED"); 
      
    });

  }); 
