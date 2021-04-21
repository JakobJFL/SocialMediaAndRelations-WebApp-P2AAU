let maxDate = new Date();
maxDate.setFullYear(maxDate.getFullYear() - 13);
let dd = maxDate.getDate();
let mm = maxDate.getMonth()+1; //January is 0!
let yyyy = maxDate.getFullYear();
if(dd<10)
    dd = '0'+dd;
if(mm<10)
	mm = '0'+mm;

maxDate = yyyy+'-'+mm+'-'+dd;
document.getElementById("birthDate").setAttribute("max", maxDate);

document.getElementById("accInfo").addEventListener("submit", sendData); // kører sendData når klikkes på knappen eller når der er enter
function sendData() {
	let firstName = document.getElementById("firstName").value; // skriv id af det input du vil bruge 
	let lastName = document.getElementById("lastName").value;  
	let inputEmail = document.getElementById("inputEmail").value; 
	let password = document.getElementById("password").value; 

	let birthDate = document.getElementById("birthDate").value; 
	console.log(birthDate);

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
	fetch('../makeUser', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(jsonBody),
	})
	.then(response => {
		console.log(response.status);
		let errorField = document.getElementById("errorField");
		if (response.status === 200) {
			window.location.replace("https://sw2c2-19.p2datsw.cs.aau.dk/node0/");
		}
		else if (response.status === 400) {
			errorField.innerHTML = "Input er forkert, check email adresse og undgå specialtegn";
		}
		else {
			errorField.innerHTML = "Der er opstået en ukendt fejl";
		}
	})
	.catch((error) => {
		console.error('Error:', error);
	});
}

function check(input) {
	if (input.value != document.getElementById('password').value) {
		input.setCustomValidity('Adgangskoderne skal være identiske');
	} else {
		// input is valid -- reset the error message
		input.setCustomValidity('');
	}
}

function checkNames(input) {
	if (String(input.value).length > 15) {
		input.setCustomValidity('Navn er for lang');
	} else {
		// input is valid -- reset the error message
		input.setCustomValidity('');
	}
}
