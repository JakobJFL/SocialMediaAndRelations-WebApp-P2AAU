function dbConnect() {
	return mysql.createConnection({ 
		host: "localhost", 
		user: "sw2c2-19", 
		password: "VCp2rR3zG6msejsZ", 
		database: "sw2c2_19" 
	});
}

function createStudy(body) {
	const DBConnection = dbConnect();
	DBConnection.connect(function(err) {
		if (err) throw err;
		let sql = `INSERT INTO studys(name, priority) VALUES (
			${mysql.escape(body.name)},
			${mysql.escape(body.priority)});`;
		DBConnection.query(sql, function (err, result) {
		if (err) throw err;
		});
		DBConnection.end();
	});
}

let body = {
    name: "Software",
    priority: 1
}
createStudy(body);