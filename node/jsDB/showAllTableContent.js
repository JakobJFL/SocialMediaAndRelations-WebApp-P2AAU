import mysql from "mysql";
 
var con = mysql.createConnection({ 
  host: "localhost", 
  user: "sw2c2-19", 
  password: "VCp2rR3zG6msejsZ", 
  database: "sw2c2_19" 
});

con.connect(function(err) {

con.query("SELECT * FROM users", function (err, result, fields) {
    if (err) throw err;
    console.table(result);
});


con.query("SELECT * FROM chatGroups", function (err, result, fields) {
    if (err) throw err;
    console.table(result);
});


con.query("SELECT * FROM messages", function (err, result, fields) {
    if (err) throw err;
    console.table(result);
});

});