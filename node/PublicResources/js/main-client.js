//'use strict'
//SEE: https://javascript.info/strict-


let loginData={};
function getLoginData() {
    loginData.email=String(document.getElementById("inputEmail").value);
    loginData.password=String(document.getElementById("inputPassword").value);
  }

function getChatSiteBtn(event) {
  event.preventDefault(); //we handle the interaction with the server rather than browsers form submission
  getLoginData();
  getChatSite();
  listenerChats();
}

function getChatSite() {
  	fetch('https://sw2c2-19.p2datsw.cs.aau.dk/node0/chat', {
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

function listenerChats() {
	let chat = new EventSourcePolyfill("https://sw2c2-19.p2datsw.cs.aau.dk/node0/chatSSE", {
		headers: {
			'Authorization': 'Basic '+btoa(loginData.email + ":" + loginData.password), 
		}
	});
	chat.addEventListener("chat", event => { // When a chat message arrives
		let responseObj = JSON.parse(event.data);
		console.log(responseObj);

	});
}

function storeUser(usernameID) {
  	sessionStorage.setItem('usernameID', usernameID);
}

function newMessage(groupID, userId) {
	let message = String(document.getElementById("messageSenderBox").value);
	let jsonBody = {
		group_id: groupID,
		user_id: userId,
		msg_content: message
	};

  	fetch('https://sw2c2-19.p2datsw.cs.aau.dk/node0/newMessageSSE', {
		method: 'POST',
		headers: {
			'Authorization': 'Basic '+btoa(loginData.email + ":" + loginData.password), 
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(jsonBody),
	})
	.then(response => {
		//console.log(response);
		//storeUser();
	})
	.catch((error) => {
		console.error('Error:', error);
	});
}

document.getElementById("loginBtn").addEventListener("submit", getChatSiteBtn);

function changeGroup(groupID) {
	fetch('https://sw2c2-19.p2datsw.cs.aau.dk/node0/chat?id='+groupID, {
		method: 'GET', // or 'PUT'
		headers: {
			'Authorization': 'Basic '+btoa(loginData.email + ":" + loginData.password), 
			'Content-Type': 'text/html',
		},
	})
	.then(response => response.text())
	.then(data => {
		if (data.startsWith("Error:403")) {
			console.error("Adgangskode eller brugernavn er forkert");
		}
		else {
			document.body.innerHTML = data;
		}
		//console.log(data);

		//storeUser();
	})
	.catch((error) => {
		console.error('Error:', error);
	});
}

