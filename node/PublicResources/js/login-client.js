//'use strict'
//SEE: https://javascript.info/strict-

function getLoginData() {
    let loginData={};
    loginData.email=String(document.getElementById("inputEmail").value);
    loginData.password=String(document.getElementById("inputPassword").value);
    console.log(JSON.stringify(loginData));

    return loginData;
  }

function sendLoginData(event) {
  console.log("mus");

  event.preventDefault(); //we handle the interaction with the server rather than browsers form submission
  let loginData=getLoginData();

  fetch('https://sw2c2-19.p2datsw.cs.aau.dk/node0/chat/', {
		method: 'GET', // or 'PUT'
		headers: {
			'Authorization': 'Basic '+btoa(loginData.email + ":" + loginData.password), 
			'Content-Type': 'text/html',
		},
	})
	.then(response => response.text())
	.then(data => {
		if (data.startsWith("Error:403")) {
			let errorField = document.getElementById("errorField");
			errorField.innerHTML = "Adgangskode eller brugernavn er forkert";
			errorField.style = "visibility:show";
		}
		else {
			document.querySelectorAll('link[rel="stylesheet"]').forEach(el => el.parentNode.removeChild(el)); // SRY men ved ellers ikke hvordan
			document.body.innerHTML = data;
		}
		//console.log(data);

		//storeUser();
	})
	.catch((error) => {
		console.error('Error:', error);
	});
}

function storeUser(usernameID) {
  	sessionStorage.setItem('usernameID', usernameID);
}

document.getElementById("loginBtn").addEventListener("submit", sendLoginData);


