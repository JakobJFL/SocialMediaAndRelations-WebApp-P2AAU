//'use strict'
//SEE: https://javascript.info/strict-
let userID = 0; 
let groupID = 0; 
let thisFname = ""; 
let thisLname = ""; 
let loginData = {};
let evtSource;
const messageLengthToAddDummy = 40;

window.addEventListener("load", getLoginData);
document.getElementById("loginBtn").addEventListener("submit", loginBtn_Submit);

function getLoginData() {
	let email = sessionStorage.getItem('email');
	let password = sessionStorage.getItem('password');
	if (email && password) {
		loginData.email = email;
		loginData.password = password;
		setMainPage();
	}
}

function logOut() {
	sessionStorage.removeItem('email');
	sessionStorage.removeItem('password');
	location.reload();
}

function loginBtn_Submit(event) {
	event.preventDefault(); //Handle the interaction with the server rather than browsers form submission
	loginData.email = String(document.getElementById("inputEmail").value);
    loginData.password = String(document.getElementById("inputPassword").value);
	setMainPage();
}

function setMainPage() {
	getChatSite().then(data => {
		storeUser(loginData.email, loginData.password);
		document.querySelectorAll('link[rel="stylesheet"]').forEach(el => el.parentNode.removeChild(el)); // Delete old stylesheets
		document.head.innerHTML = printHead();
		document.body.innerHTML = data;
		document.getElementById("logOutBtn").addEventListener("click", logOut);
		
		showWelcomeBox();
		addSSEListener();
		startCountDown();
	}).catch((err) => showError(err.message));
}

function getChatSite(cGroup_id) {
	return new Promise((resolve, reject) => {
		let changeGroup = "";
		if (cGroup_id) 
			changeGroup = "?groupID="+cGroup_id;
		fetch('chat'+changeGroup, {
			method: 'GET', 
			headers: {
				'Authorization': 'Basic '+btoa(loginData.email + ":" + loginData.password), 
				'Content-Type': 'text/html',
			},
		}).then(response => {
			userID = response.headers.get('user_ID');
			thisFname = response.headers.get('fname');
			thisLname = response.headers.get('lname');
			if (response.status === 200) {
				return response.text();
			} 
			else if (response.status === 403)
				throw new Error("Adgangskode eller brugernavn er forkert");
			else
				throw new Error("Der er opstået en ukendt fejl");
		}).then(data => resolve(data))
		.catch((err) => reject(err));
	});
}

function showError(msg) {
	let errorField = document.getElementById("errorField");
	console.error(msg)
	errorField.innerHTML = msg;
	errorField.style = "visibility:show";
}

function printHead() {
	return `<meta charset="UTF-8">
			<meta http-equiv="X-UA-Compatible" content="IE=edge">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<link rel="apple-touch-icon" sizes="180x180" href="pictures/faviconPackage/apple-touch-icon.png">
			<link rel="icon" type="image/png" sizes="32x32" href="pictures/faviconPackage/favicon-32x32.png">
			<link rel="icon" type="image/png" sizes="16x16" href="pictures/faviconPackage/favicon-16x16.png">
			<link rel="manifest" href="pictures/faviconPackage/site.webmanifest">
			<link rel="mask-icon" href="pictures/faviconPackage/safari-pinned-tab.svg" color="#5bbad5">
			<meta name="msapplication-TileColor" content="#da532c">
			<meta name="theme-color" content="#55be92">
			<link rel="stylesheet" href="bootstrap/css/bootstrap.css">
			<link rel="stylesheet" href="fontAwesome-free/css/all.css">
			<link rel="stylesheet" href="css/messages.css">
			<link rel="stylesheet" href="css/chatRoomMain.css">
			<link rel="stylesheet" href="css/color.css">
			<title>Study Buddies</title>`;
}

function submitOnEnter(event){
	if (event.keyCode == 13 && !event.shiftKey) {
		event.preventDefault();
		newMessage();
	}
}

function storeUser(email, password) {
	sessionStorage.setItem('email', email);
	sessionStorage.setItem('password', password);
}

//EventSource

function addSSEListener() {
	evtSource = new EventSourcePolyfill("chatSSE", {
		headers: {
			'Authorization': 'Basic '+btoa(loginData.email + ":" + loginData.password) 
		}
	});
	evtSource.addEventListener("chat", chatEventHandler, false);

	/*document.addEventListener("visibilitychange", function() {
		if (document.hidden) {
			evtSource.close();
			evtSource.removeEventListener();
		} else {
			evtSource = new EventSourcePolyfill("chatSSE", {
			headers: {
				'Authorization': 'Basic '+btoa(loginData.email + ":" + loginData.password) 
				}
			});
			evtSource.addEventListener("chat", chatEventHandler);
		}
	});
	*/
}

function chatEventHandler(event) {
	let responseObj = JSON.parse(event.data);
	const dateStr = getDateNow();
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

function getDateNow() {
	const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	const dNow = new Date();
	const month = monthNames[dNow.getMonth()]
	return dNow.getDate() + "/" + month + " " + dNow.getFullYear() + " " + dNow.getHours() + ":" + (dNow.getMinutes()<10?'0':'')+dNow.getMinutes();
}

function addChatSender(message, userName, date) {
	let dummy = "";
	if (message.length <= messageLengthToAddDummy )
		dummy = `<div class="dummy-space-left"></div>`

	let resSender = `<div class="media sender-msg mb-3">
	<img src="pictures/profile.jpg" alt="user" width="50" class="rounded-circle">
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

function newMessage() {
	let message = String(document.getElementById("messageSenderBox").value);
	let jsonBody = {
		group_id: Number(groupID),
		msg_content: message,
		fname: thisFname,
		lname: thisLname
	};
	document.getElementById("messageSenderBox").value = "";
  	fetch('newMessageSSE', {
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
	//evtSource.removeEventListener();
	//evtSource.close();
	getChatSite(cGroup_id).then(data => {
		groupID = cGroup_id;
		document.body.innerHTML = data;
		document.getElementById("logOutBtn").addEventListener("click", logOut);
		document.getElementById("btnSender").addEventListener("click", newMessage);
		document.getElementById("senderFrom").addEventListener("keypress", submitOnEnter);
		//addSSEListener();
		startCountDown();
	}).catch((err) => console.error(err.message));
	
	/*
	fetch('chat?groupID='+cGroup_id, {
		method: 'GET', 
		headers: {
			'Authorization': 'Basic '+btoa(loginData.email + ":" + loginData.password), 
			'Content-Type': 'text/html',
		},
	})
	.then(response => response.text())
	.then(data => {
		if (data.startsWith("Error:403")) 
			console.error("Adgangskode eller brugernavn er forkert");
		else {
			document.body.innerHTML = data;
			groupID = cGroup_id;
			document.getElementById("btnSender").addEventListener("click", newMessage);
			document.getElementById("senderFrom").addEventListener("keypress", submitOnEnter);
			document.getElementById("logOutBtn").addEventListener("click", logOut);
		}
	})
	.catch((error) => {
		console.error('Error:', error);
	});
	*/
}

function showWelcomeBox() {
	let html = `<div>
	<div class="jumbotron">
			<h1 class="display-4">Velkommen til Study Buddies! <img class="mb-4" src="pictures/logo.png" alt="" width="75" height="75"></h1>
		<p class="lead">Den sociale platform, til dig som gerne vil skabe nye relationer blandt dine medstuderende.
		</p>
		<h2><i class="fa fa-question-circle text-muted"></i> <small class="text-muted"> Guide</small></h2>
		<div>Hver dag klokken <b>16:00</b> GMT+2, vil der blive dannet nye samtalegrupper. Find chatmenuen i venstre side af skærmen, eller hvis du er på mobil med denne knap: <i class="fa fa-bars text-muted"></i>. Her får du vist de grupper du er medlem af og du kan vælge hvilken gruppesamtale du vil skrive i.</div>
		<br>
		<h2><i class="fa fa-users text-muted"></i> <small class="text-muted"> Gruppedannelse</small></h2>
		<div>Hver dag klokken 16:00 GMT+2, vil der blive dannet nye samtalegrupper.</div>
		<div>Grupperne bliver tilfældigt sammensat ud fra din studieretning. Hvis der er ikke er nok brugere med den samme studieretning som dig, vil brugere med studieretninger der minder om din, blive en del af din gruppe. Størrelsen for en gruppe er 4-5 personer.</div>
		<br>
		<h2><i class="fa fa-users text-muted"></i> <small class="text-muted"> Inaktive grupper</small></h2>
		<p>Grupperne bliver automatisk slettet, hvis der ikke har været aktivitet i gruppen efter 5 dage.</p>
		
	</div>
	<div class="jumbotron">
		<h2><i class="fa fa-book text-muted"></i> <small class="text-muted"> Om projektet</small></h2>
		<p>Study Buddies er udviklet på Aalborg Universitet af gruppen C2-19 i deres software projekt på 2. semester. Koden bag projektet kan findes på GitHub <a href="https://github.com/JakobJFL/SocialMediaAndRelations-WebApp-P2AAU">her</a>.</p>
		<p>Der er også udviklet en rapport som en del af projektet.</p>
		<p class="lead">
			<a class="btn btn-primary btn" href="#" role="button">Se rapport</a>
		</p>
	</div>
</div>
</main>`;
	document.getElementById('welcomeBox').innerHTML = html;
}
