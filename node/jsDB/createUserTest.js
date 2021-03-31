import mysql from "mysql";

function createUser(password,fname,lname,mail,intrest1,intrest2,intrest3){
  var con = mysql.createConnection({ 
    host: "localhost", 
    user: "sw2c2-19", 
    password: "VCp2rR3zG6msejsZ", 
    database: "sw2c2_19" 
  });

  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    var sql = "INSERT INTO users(user_psw, user_name, user_lname, user_mail, user_intrest1, user_intrest2, user_intrest3, CHG_TIMESTAMP) VALUES ('" + password + "', '" + fname + "', '" + lname + "', '" + mail + "', '" + intrest1 + "', '" + intrest2 + "', '" + intrest3 + "', '2021-03-26 15:03:10.000000');";
    console.log(sql)
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");
    });
  });
}


createUser("password","fname","lname","danni.dahl@gmail.com",1234,1234,1234)


