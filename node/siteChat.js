export {printChatPage};
import {getGroups, getChats} from "./database.js";

const messageLengthToAddDummy = 40;

function printChatPage(userID, fname, lname, url) {
	console.log("ID: " + userID + " loged on");
    let top = `<!DOCTYPE html><html lang="en">`;
    let bottom = 
    `<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/js/bootstrap.bundle.min.js" integrity="sha384-b5kHyXgcpbZJO/tY9Ul7kGkf1S0CWuKcCD38l8YkeH8z8QjE0GmW1gYU5S9FOnJ0" crossorigin="anonymous"></script>
    <script type="text/javascript" src="../node0/js/src/eventsource.min.js"></script>
    <script type="text/javascript" src="../node0/js/main-client.js"></script>
    </body>
    </html>`

    let bodyPromise = new Promise((resolve,reject) => {
		printBody(userID, fname, lname, url).then(html => {
			let res = top+printHead()+html+bottom;
			resolve(res);
			if (!html) {
				reject("promiseReject(printChatPage)");
			} 
		}).catch(err => console.error(err));
    });
    return bodyPromise;
}

function printHead() {
return `<head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="../node0/bootstrap/css/bootstrap.css">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
  
            <link rel="stylesheet" href="../node0/css/messages.css">
            <link rel="stylesheet" href="../node0/css/chatRoomMain.css">
            <link rel="stylesheet" href="../node0/css/color.css">

            <title>Social Media and Relations WebApp-P2AAU</title>
        </head>
        <body>`;
}

function printBody(userID, fname, lname, url) {
    let header = `<header class="navbar navbar-dark sticky-top flex-md-nowrap p-0 shadow">
                    <a class="navbar-brand" href="#">${fname} ${lname}</a>
                    <button class="navbar-toggler position-absolute d-md-none collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="navbar-left px-1">
                    <a class="nav-link" id="navbar-text" href="http://127.0.0.1:3280/">Log ud</a>
                    <a class="profileBtn" href="../node0/html/profile.html"></a>
                    </div>
                </header>`;   

    function addCard(title, subtitle, active, cGroupID, addActive) {
        return `<ul class="nav flex-column">
        <li class="nav-item">
          <a class="nav-link" aria-current="page" onclick="changeGroup(${cGroupID})">
            <div class="card ${addActive}">
              <div class="card-body">
                <h5 class="card-title">${title}</h5>
                <h6 class="card-subtitle mb-2 text-muted">${subtitle}</h6>
                <p class="card-active online">${active}</p>
              </div>
            </div>
          </a>
        </li>
      </ul>`
    }
    function bottomChatFun() {
      return `</div>
                </div>
                    <div class="message-sender">
                    <div class="container-fluid p-2 px-4 py-3 bg-white">
                        <form id="senderFrom" action="javascript:void(0);">
                        <div class="input-group">
                            <textarea type="textbox" role="textbox" id="messageSenderBox" data-text="Skriv en besked" aria-describedby="button-addon2" rows="1" class="form-control rounded-0 border-0 py-2 bg-light"></textarea>
                            <div class="input-group-append">
                            <button type="submit" id="btnSender" class="btn btn-outline-primary send-btn"><i class="fa fa-paper-plane" aria-hidden="true"></i></button>
                            </div>
                        </div>
                        </form>
                    </div>
                    </div>
                </div>
                </main>`;
    }

	
    let topCard = `  <div class="container-fluid"><div class="row"><nav id="sidebarMenu" class="col-md-3 col-lg-2 d-md-block sidebar collapse"><div class="position-sticky pt-3">`;
    let bottomCard = `</div></nav></div></div>`
    
    let topChat = `<main><div class="chat-box p-2 px-4 py-5 my-4"><div id="allChat">`;
                        
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

    function makeCardTitle(group) {
      let names = "";
      for (let i = 1; i <= 5; i++) {
        let key = "u"+i;
        if (group[key] !== fname) {
          names += group[key];
          if (i !== 5) 
            names += ", "
        }
      }
      return names;
    }

	let promise = new Promise((resolve,reject) => {
		let cards = topCard;
		let urlSplit = url.split("=");
		let groupID = urlSplit[1];
    let bottomChat = "";
		getGroups(userID).then(groupsData => {
      if (!groupsData) 
				reject("promiseReject(getGroups)");
			for (const group of groupsData) {
        let cardTitle = makeCardTitle(group);
				if (!groupID) 
				  groupID = group.group_id;
        bottomChat = bottomChatFun();
				if (group.group_id == groupID) { //Type conversion - groupID is string
          console.log();
          cards += addCard(cardTitle, "Ej hvor det flot", "Aktiv nu", group.group_id, "active");
        }  
				else 
					cards += addCard(cardTitle, "Ej hvor det flot", "Aktiv nu", group.group_id, "");
			}
			getChats(groupID).then(chatsData => {
        if (!chatsData) 
					reject("promiseReject(getChats)");
				let chats = "";
				for (const chat of chatsData) {
					let DBdate = String(chat.TIMESTAMP).split(/[- :]/);
					//let date = new Date(DBdate[2] + " " + DBdate[1] + " " + DBdate[3] + " " + DBdate[4] + ":" + DBdate[5]);
					let dateFormatted = DBdate[2] + "/" + DBdate[1] + " " + DBdate[3] + " " + DBdate[4] + ":" + DBdate[5];
					if (chat.user_ID === userID) 
            chats += addChatReciever(chat.msg_content, dateFormatted); 
					else 
						chats += addChatSender(chat.msg_content, chat.fname + " " + chat.lname, dateFormatted);
				}

        let res = header+cards+bottomCard+topChat+chats+bottomChat;
				resolve(res);
			  }).catch(err => console.error(err));
		  }).catch(err => console.error(err));
    });

    return promise;
}