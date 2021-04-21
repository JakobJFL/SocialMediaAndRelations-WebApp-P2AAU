document.getElementById("accInfo").addEventListener("submit", sendData); // kører sendData når klikkes på knappen, skriv id af det form eller btn 

function sendData() {
	console.log("lmao");

	let firstName = String(document.getElementById("firstName").value); // skriv id af det input du vil bruge 
	let lastName = String(document.getElementById("lastName").value);  
	let inputEmail = String(document.getElementById("inputEmail").value); 
	let password = String(document.getElementById("password").value); 
	//let study = String(document.getElementById("inputFieldsOfStudy").value); Studieretning, dette skal måske tilføjes til senere brug

	let jsonBody = {
		fname: firstName,
		lname: lastName,
		mail: inputEmail,
		intrest1: null,
		intrest2: null,
		intrest3: null,
		intrest4: null,
		psw: password

	};
  	fetch('https://sw2c2-19.p2datsw.cs.aau.dk/node0/makeUser', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(jsonBody),
    })
    .then(response => response.json())
    .then(jsonData => console.log(jsonData))
	.catch((error) => {
		console.error('Error:', error);
	});
}