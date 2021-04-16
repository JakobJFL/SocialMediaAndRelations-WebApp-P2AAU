//'use strict'
//SEE: https://javascript.info/strict-
let userID = 0; 
let groupID = 0; 

const messageLengthToAddDummy = 40;
let loginData={};
function getLoginData() {
    loginData.email=String(document.getElementById("inputEmail").value);
    loginData.password=String(document.getElementById("inputPassword").value);
  }

function getChatSiteBtn(event) {
  event.preventDefault(); //we handle the interaction with the server rather than browsers form submission
  getLoginData();
  getChatSite();

  //console.log(cards[0].innerHTML);
  //let matches = cards[0].getAttribute("onclick");
  //console.log(matches);

  listenerChats();
}

function getChatSite() {
  	fetch('https://sw2c2-19.p2datsw.cs.aau.dk/node0/chat', {
		method: 'GET', // or 'PUT'
		headers: {
			'Authorization': 'Basic '+btoa(loginData.email + ":" + loginData.password), 
			'Content-Type': 'text/html',
		},
	}).then(response => {
		userID = response.headers.get('user_ID');
		groupID = response.headers.get('group_id');
		return response.text();
	}).then(data => {
		if (data.startsWith("Error:403")) {
			let errorField = document.getElementById("errorField");
			errorField.innerHTML = "Adgangskode eller brugernavn er forkert";
			errorField.style = "visibility:show";
		}
		else if (data.startsWith("Error")) {
			let errorField = document.getElementById("errorField");
			errorField.innerHTML = "Der er opstået en ukendt fejl";
			errorField.style = "visibility:show";
		}
		else {
			document.querySelectorAll('link[rel="stylesheet"]').forEach(el => el.parentNode.removeChild(el)); // SRY men ved ellers ikke hvordan
			document.body.innerHTML = data;
			document.getElementById("btnSender").addEventListener("click", newMessage);
			document.getElementById("senderFrom").addEventListener("keypress", submitOnEnter);
		}
		//console.log(data);

		//storeUser();
	})
	.catch((error) => {
		console.error('Error:', error);
	});
}

function submitOnEnter(event){
	if (event.keyCode == 13 && !event.shiftKey) {
		event.preventDefault();
		newMessage();
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

function listenerChats() {
	let chat = new EventSourcePolyfill("https://sw2c2-19.p2datsw.cs.aau.dk/node0/chatSSE", {
		headers: {
			'Authorization': 'Basic '+btoa(loginData.email + ":" + loginData.password), 
		}
	});
	chat.addEventListener("chat", event => { // When a chat message arrives
		let responseObj = JSON.parse(event.data);
		//console.log(responseObj.user_id, user_ID);
		//console.log(responseObj.group_id, groupID);
		if (responseObj.group_id == groupID) {
			if (String(responseObj.user_id) !== userID) {
				let nodeStr = addChatSender(responseObj.msg_content, responseObj.user_id, "dd");
				let allChat = document.getElementById("allChat");
				allChat.insertAdjacentHTML('beforeend', nodeStr);
			}
			else {
				let nodeStr = addChatReciever(responseObj.msg_content, "dff");
				let allChat = document.getElementById("allChat");
				allChat.insertAdjacentHTML('beforeend', nodeStr);
			}
		}
	});
}

function storeUser(usernameID) {
  	sessionStorage.setItem('usernameID', usernameID);
}

function newMessage() {
	let message = String(document.getElementById("messageSenderBox").value);
	let jsonBody = {
		group_id: Number(groupID),
		user_id: Number(userID),
		msg_content: message
	};
	document.getElementById("messageSenderBox").value = "";
  	fetch('https://sw2c2-19.p2datsw.cs.aau.dk/node0/newMessageSSE', {
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

document.getElementById("loginBtn").addEventListener("submit", getChatSiteBtn);

function changeGroup(group_id) {
	fetch('https://sw2c2-19.p2datsw.cs.aau.dk/node0/chat?id='+group_id, {
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
			groupID = group_id;
			document.getElementById("btnSender").addEventListener("click", newMessage);
			document.getElementById("senderFrom").addEventListener("keypress", submitOnEnter);
		}
		//console.log(data);

		//storeUser();
	})
	.catch((error) => {
		console.error('Error:', error);
	});
}

