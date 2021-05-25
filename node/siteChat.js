export {printChatPage};
import {groupSize} from "./app.js"
import {getGroups, getChats, getLastMessage} from "./database.js";

const messageLengthToAddDummy = 40;

//return promise that resolves the html body for chat page
function printChatPage(userID, fname, parmsGroupID) {
    let bottom = `<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/js/bootstrap.bundle.min.js"integrity="sha384-b5kHyXgcpbZJO/tY9Ul7kGkf1S0CWuKcCD38l8YkeH8z8QjE0GmW1gYU5S9FOnJ0"crossorigin="anonymous"></script>
	<script type="text/javascript" src="/js/eventsourceLib/src/eventsource.min.js"></script>
	<script type="text/javascript" src="/js/eventsourceLib/src/eventsource.js"></script>
    <script type="text/javascript" src="/js/main-client.js"></script>
    <script type="text/javascript" src="/js/countdown.js"></script>
    </body>
    </html>`

    let bodyPromise = new Promise((resolve,reject) => {
		printBody(userID, fname, parmsGroupID).then(html => {
			let res = html+bottom;
			resolve(res);
			if (!html) {
				reject("promiseReject(printChatPage)");
			} 
		}).catch(err => console.error(err));
    });
    return bodyPromise;
}

async function printBody(userID, fname, parmsGroupID) {
    let countdownCard = `<ul class="nav flex-column">
							<li class="nav-item">
								<div class="nav-link" aria-current="page" onclick="location.reload();">
								<div class="card static">
									<div class="card-body">
									<h6 class="card-subtitle text-muted" id="countdown">Ny gruppe om: </h6>
									</div>
								</div>
								</div>
							</li>
							</ul>`
    let topCard = `<div class="container-fluid"><div class="row"><nav id="sidebarMenu" class="col-md-3 col-lg-2 d-md-block sidebar collapse"><div class="position-sticky pt-3">`;
    let bottomCard = `</div></nav></div></div>`
    let topMain = `<main>`;
	let topChat = `<div class="chat-box p-2 px-4 py-5 my-4"><div id="allChat">`;
	let bottomChat = `</div>
						</div>
							<div class="message-sender">
							<div class="container-fluid p-2 px-4 py-3 bg-white">
								<form id="senderFrom" action="javascript:void(0);">
								<div class="input-group">
									<textarea type="textbox" role="textbox" id="messageSenderBox" data-text="Skriv en besked" aria-describedby="button-addon2" rows="1" class="form-control rounded-0 border-0 py-2 bg-light"></textarea>
									<div class="input-group-append">
									<button type="submit" id="btnSender" class="btn btn-outline-primary send-btn"><i class="fas fa-paper-plane"></i></button>
									</div>
								</div>
								</form>
							</div>
							</div>
						</div>
						</main>`;
	let cards = topCard+countdownCard;
	let groupID = parmsGroupID;
	let groupsData = await getGroups(userID);
	if (!groupsData) 
		reject("promiseReject(getGroups)");
	for (const group of groupsData) {
		let lastMessage = await getLastMessage(group.group_id);
		cards += insertCards(group, lastMessage, fname, groupID);
	}
	let main;
	if (!groupID) {
		main = `<div class="welcome-box p-2 px-4 py-5 my-4" id="welcomeBox"></div>`;
		return getHeader()+cards+bottomCard+topMain+main;
	}
	else {
		let chatsData = await getChats(groupID);
		main = topChat;
		main += addChats(chatsData, userID);
		return getHeader()+cards+bottomCard+topMain+main+bottomChat;
	} 
}

//return string html with cards(sidebar menu selectors) 
function insertCards(group, lastMessage, fname, groupID) {
	let cards = "";
	let cardTitle = getCardTitle(group, fname);
	let cardSubtitle = getCardSubtitle(group);
	let lastMessageDate = "Ingen beskeder";
	if (lastMessage) 
		lastMessageDate = timeSince(lastMessage.TIMESTAMP);

	if (group.group_id == groupID) //Allow type conversion
		cards += addCard(cardTitle, cardSubtitle, lastMessageDate, group.group_id, "active"); 
	else 
		cards += addCard(cardTitle, cardSubtitle, lastMessageDate, group.group_id, "");
	return cards;
}

//Returns names of people in the group except for the that is logged in
function getCardTitle(group, fname) {
	let names = "";
	let isNameDel = false;
	for (let i = 1; i <= groupSize; i++) {
		let key = "u"+i; 
		if (group[key] === fname && !isNameDel)
			isNameDel = true;
		else {
			if (group[key]) {
				if (names !== "") 
					names += ", ";
				names += group[key];
			}
		}
	}
	return names;
}

//Returns studys of people in the group
function getCardSubtitle(group) {
	let study = "";
	let preGroups = "";
	for (let i = 1; i <= groupSize; i++) {
		let key = "s"+i; 
		if (preGroups !== group[key] && group[key] !== null) {
			if (i !== 1) 
				study += ", ";
			study += group[key];
		}
		preGroups = group[key];
	}
	return study;
}

function timeSince(date) {
	let seconds = Math.floor((new Date() - date) / 1000);
	let interval = seconds / 31536000;
	interval = seconds / 86400;
	if (interval > 1) 
		if (interval < 2)
			return Math.floor(interval) + " Dag";
		else
			return Math.floor(interval) + " Dage";
	interval = seconds / 3600;
	if (interval > 1) 
		if (interval < 2)
			return Math.floor(interval) + " Time";
		else
			return Math.floor(interval) + " Timer";
	interval = seconds / 60;
	if (interval > 1) 
		if (interval < 2)
	  		return Math.floor(interval) + " Minut";
		else
			return Math.floor(interval) + " Minutter";
	return "Aktiv nu";
}

function addCard(title, subtitle, active, cGroupID, addActive) {
	let cardActiveHtml = `<p class="card-active">${active}</p>`;
	if (active === "Aktiv nu") 
		cardActiveHtml = `<p class="card-active online">Aktiv nu</p>`;
		
	return `<ul class="nav flex-column">
				<li class="nav-item">
				<a class="nav-link" aria-current="page" onclick="changeGroup(${cGroupID})">
					<div class="card ${addActive}">
					<div class="card-body">
						<h5 class="card-title">${title}</h5>
						<h6 class="card-subtitle mb-2 text-muted">${subtitle}</h6>
						${cardActiveHtml}
					</div>
					</div>
				</a>
				</li>
			</ul>`
}

function addChats(chatsData, userID) {
	let chats = "";
	if (!chatsData) 
		reject("promiseReject(getChats)");
	for (const chat of chatsData) {
		let DBdate = String(chat.TIMESTAMP).split(/[- :]/);
		let dateFormatted = DBdate[2] + "/" + DBdate[1] + " " + DBdate[3] + " " + DBdate[4] + ":" + DBdate[5];
		if (chat.user_ID === userID) 
			chats += addChatReciever(chat.msg_content, dateFormatted); 
		else 
			chats += addChatSender(chat.msg_content, chat.fname + " " + chat.lname, dateFormatted);
	}
	return chats;
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

function getHeader() {
	return `<header class="navbar navbar-dark sticky-top flex-md-nowrap p-0 shadow">
				<a class="navbar-brand text-white">Study Buddies</a>
				<button class="navbar-toggler position-absolute d-md-none collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">
					<span class="navbar-toggler-icon"></span>
				</button>
				<div class="navbar-left px-1">
				<a class="nav-link navbar-text" id="logOutBtn">Log ud</a>
				<a class="profileBtn" href="#"></a>
				</div>
			</header>`;   
}
