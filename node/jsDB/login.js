



function login(email, password){
    var mysql = require('mysql'); 
 
    var con = mysql.createConnection({ 
      host: "localhost", 
      user: "sw2c2-19", 
      password: "VCp2rR3zG6msejsZ", 
      database: "sw2c2_19" 
    });

    con.connect(function(err) {
    if (err) throw err;
      con.query("SELECT user_id FROM users WHERE user_mail = " + mysql.escape(email) + " AND user_psw = " + mysql.escape(password) , function (err, result, fields) {    
          if (err) throw err;
          console.log(result);
    });
  });
}

login("danni.dahl@gmail.com", "password")