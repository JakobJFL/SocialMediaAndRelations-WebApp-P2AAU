deleteGroup(8);

import mysql from "mysql";

function dbConnect() {
	return mysql.createConnection({ 
		host: "localhost", 
		user: "sw2c2-19", 
		password: "VCp2rR3zG6msejsZ", 
		database: "sw2c2_19" 
	});
}
function deleteGroup(userID) {
	const DBConnection = dbConnect();
	DBConnection.connect(function(err){
		if (err) 
			console.error(err);
		DBConnection.query("DELETE FROM users WHERE user_id = " + mysql.escape(userID),
		function (err, result, fields) {   
			if(err) 
				console.error(err);
			else {
				console.log(result);
				DBConnection.end();
			}
		});
	});
}