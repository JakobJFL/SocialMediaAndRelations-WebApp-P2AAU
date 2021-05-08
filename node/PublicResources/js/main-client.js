//'use strict'
//SEE: https://javascript.info/strict-
let userID = 0; 
let groupID = 0; 
let thisFname = ""; 
let thisLname = ""; 
let loginData = {};
const messageLengthToAddDummy = 40;

function getLoginData() {
    loginData.email = String(document.getElementById("inputEmail").value);
    loginData.password = String(document.getElementById("inputPassword").value);
}

document.getElementById("loginBtn").addEventListener("submit", loginBtn_Submit);

function loginBtn_Submit(event) {
	event.preventDefault(); //Handle the interaction with the server rather than browsers form submission
	getLoginData();
	getChatSite();
	addSSEListeners();
	startCountDown();
}

function getChatSite() {
  	fetch('../node0/chat', {
		method: 'GET', 
		headers: {
			'Authorization': 'Basic '+btoa(loginData.email + ":" + loginData.password), 
			'Content-Type': 'text/html',
		},
	}).then(response => {
		userID = response.headers.get('user_ID');
		thisFname = response.headers.get('fname');
		thisLname = response.headers.get('lname');
		return response.text();
	}).then(data => {
		if (data.startsWith("Error:403")) 
			showError("Adgangskode eller brugernavn er forkert");
		else if (data.startsWith("Error")) 
			showError("Der er opstået en ukendt fejl");
		else {
			document.querySelectorAll('link[rel="stylesheet"]').forEach(el => el.parentNode.removeChild(el)); 
			document.body.innerHTML = data;
		}
		//storeUser();
	})
	.catch((error) => {
		console.error('Error:', error);
	});
}

function showError(msg) {
	let errorField = document.getElementById("errorField");
	errorField.innerHTML = msg;
	errorField.style = "visibility:show";
}

function submitOnEnter(event){
	if (event.keyCode == 13 && !event.shiftKey) {
		event.preventDefault();
		newMessage();
	}
}

function storeUser(usernameID) {
	sessionStorage.setItem('usernameID', usernameID);
}

//EventSource
function addSSEListeners() {
	let chat = new EventSourcePolyfill("../node0/chatSSE", {
			headers: {
				'Authorization': 'Basic '+btoa(loginData.email + ":" + loginData.password) 
			}
		});
	chat.addEventListener("chat", chatEventHander);
	/*
	document.addEventListener("visibilitychange", function() {
		if (document.hidden) {
			chat.removeEventListener();
		} else {
			chat.addEventListener("chat", chatEventHander);
		}
	});
	*/

	function chatEventHander(event) {
		let responseObj = JSON.parse(event.data);
		const monthNamesDK = ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun","Jul", "Aug", "Sep", "Okt", "Nov", "Dec"];
		const dNow = new Date();
		const month = monthNamesDK[dNow.getMonth()]
		const dateStr = dNow.getDate() + "/" + month + " " + dNow.getFullYear() + " " + dNow.getHours() + ":" + dNow.getMinutes();
		if (String(responseObj.group_id) == groupID) { //Allow type conversion
			let allChats = document.getElementById("allChat");
			if (String(responseObj.user_id) != userID) { //Allow type conversion
				let nodeStr = addChatSender(responseObj.msg_content, responseObj.fname + " " + responseObj.lname, dateStr);
				allChats.insertAdjacentHTML('beforeend', nodeStr);
			}
			else {
				let nodeStr = addChatReciever(responseObj.msg_content, dateStr);
				allChats.insertAdjacentHTML('beforeend', nodeStr);
			}
		}
	}
}

function addChatSender(message, userName, date) {
	let dummy = "";
	if (message.length <= messageLengthToAddDummy )
		dummy = `<div class="dummy-space-left"></div>`

	let resSender = `<div class="media sender-msg mb-3">
	<img src="../node0/pictures/WICKED.png" alt="user" width="50" class="rounded-circle">
	<div class="media-body py-2 ml-3">
	  <p class="small top-text-muted">${userName}</p>
	  <div class="bg-grey rounded py-2 px-3 mb-2">
		<p class="text-small mb-0">${message}</p>
	  </div>
	</div>
	<p class="small text-muted text-bottom-sender">${date}</p>
	${dummy}
  </div>`;
  return resSender;
}

function addChatReciever(message, date) {
	let dummy = "";
	if (message.length <= messageLengthToAddDummy)
		dummy = `<div class="dummy-space-right"></div>`

	let resReciever = `<div class="media reciever-msg mb-3">
	${dummy}
	<div class="media-body">
	  <div class="bg-primary rounded py-2 px-3 mb-2">
		<p class="text-small mb-0 text-white">${message}</p>
	  </div>
	</div>
	<p class="small text-muted text-bottom-reciever">${date}</p>
  </div>`;
  return resReciever;
}

//POST new Message
function newMessage() {
	let message = String(document.getElementById("messageSenderBox").value);
	let jsonBody = {
		group_id: Number(groupID),
		msg_content: message,
		fname: thisFname,
		lname: thisLname
	};
	document.getElementById("messageSenderBox").value = "";
  	fetch('../node0/newMessageSSE', {
		method: 'POST',
		headers: {
			'Authorization': 'Basic '+btoa(loginData.email + ":" + loginData.password), 
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(jsonBody),
	}).catch((error) => {
		console.error('Error:', error);
	});
}

function changeGroup(cGroup_id) {
	fetch('../node0/chat?groupID='+cGroup_id, {
		method: 'GET', 
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
			groupID = cGroup_id;
			document.getElementById("btnSender").addEventListener("click", newMessage);
			document.getElementById("senderFrom").addEventListener("keypress", submitOnEnter);
		}
	})
	.catch((error) => {
		console.error('Error:', error);
	});
}

