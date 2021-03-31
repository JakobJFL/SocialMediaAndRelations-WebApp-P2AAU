var mysql = require('mysql'); 
 
var con = mysql.createConnection({ 
  host: "localhost", 
  user: "sw2c2-19", 
  password: "VCp2rR3zG6msejsZ", 
  database: "sw2c2_19" 
});

con.connect(function(err) { 
    if (err) throw err; 
    console.log("Connected!"); 
  }); 
  
  