let maxDate = new Date();
maxDate.setFullYear(maxDate.getFullYear() - 13);
let dd = maxDate.getDate();
let mm = maxDate.getMonth()+1; //January is 0
let yyyy = maxDate.getFullYear();
if(dd<10)
    dd = '0'+dd;
if(mm<10)
	mm = '0'+mm;
maxDate = yyyy+'-'+mm+'-'+dd;
document.getElementById("birthDate").setAttribute("max", maxDate);

document.getElementById("accInfo").addEventListener("submit", sendData); // kører sendData når klikkes på knappen eller når der er enter

function sendData() {
	let jsonBody = {
		fname: document.getElementById("firstName").value,
		lname: document.getElementById("lastName").value,
		mail: document.getElementById("inputEmail").value,
		birthDate: document.getElementById("birthDate").value,
		study: document.getElementById("inputFieldsOfStudy").value,
		psw: document.getElementById("password").value
	}; 
	fetch('makeUser', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(jsonBody),
	})
	.then(response => {
		if (response.status === 200) 
			window.location.replace("../");
		else if (response.status === 400) 
			showError("Input er forkert, check e-mail adresse og undgå specialtegn");
		else 
			showError("Der er opstået en ukendt fejl");
	})
	.catch((error) => {
		console.error('Error:', error);
		showError("Der er opstået en ukendt fejl");
	});
}

function showError(msg) {
	let errorField = document.getElementById("errorField");
	errorField.innerHTML = msg;
	errorField.style = "visibility:show";
}

function checkPas(input) {
	if (input.value != document.getElementById('password').value) {
		input.setCustomValidity('Adgangskoderne skal være identiske');
	}
	else 
		input.setCustomValidity('');
}