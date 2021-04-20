import mysql from "mysql";
var con = mysql.createConnection({ 
  host: "localhost", 
  user: "sw2c2-19", 
  password: "VCp2rR3zG6msejsZ", 
  database: "sw2c2_19" 
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  var sql = "ALTER TABLE messages CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;";
  console.log(sql)
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("CHARACTER SET change");
  });
});
