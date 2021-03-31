export {printChatPage};

function printChatPage() {
    let top = `<!DOCTYPE html><html lang="en">`;
    let bottom = 
    `<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/js/bootstrap.bundle.min.js" integrity="sha384-b5kHyXgcpbZJO/tY9Ul7kGkf1S0CWuKcCD38l8YkeH8z8QjE0GmW1gYU5S9FOnJ0" crossorigin="anonymous"></script>
    <script type="text/javascript" src="../json/userTestData.json"></script>
    <script type="text/javascript" src="../json/commonInterestsData.json"></script>
    <script type="text/javascript" src="../js/testOfAlgorithm.js"></script>
    </html>`
    return top+printHead()+printBody()+bottom;
}

function printHead() {
return `<head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="../bootstrap/css/bootstrap.css">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

            <link rel="stylesheet" href="../css/messages.css">
            <link rel="stylesheet" href="../css/chatRoomMain.css">
            <link rel="stylesheet" href="../css/color.css">

            <title>Social Media and Relations WebApp-P2AAU</title>
        </head>`;
}

function printBody() {
    let header = `<header class="navbar navbar-dark sticky-top flex-md-nowrap p-0 shadow">
                    <a class="navbar-brand" href="#">Skabelon til vores chat</a>
                    <button class="navbar-toggler position-absolute d-md-none collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="navbar-left px-1">
                    <a class="nav-link" id="navbar-text" href="http://127.0.0.1:3280/">Log ud</a>
                    <a class="profileBtn" href="../html/profile.html"></a>
                    </div>
                </header>`;   

    function addCard(title, subtitle, active) {
        return `<ul class="nav flex-column">
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="#">
            <div class="card">
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
    let topCard = `  <div class="container-fluid"><div class="row"><nav id="sidebarMenu" class="col-md-3 col-lg-2 d-md-block sidebar collapse"><div class="position-sticky pt-3">`;
    let bottomCard = `</div></nav></div></div>`
    let cards = topCard;
    for (let i = 0; i < 10; i++) {
        cards += addCard("Mig, Mig", "Software", "Aktiv nu")
    }

    let topChat = `<main><div class="chat-box p-2 px-4 py-5 my-4"><div>`;
    let bottomChat = `</div>
                        </div>
                            <div class="message-sender">
                            <div class="container-fluid p-2 px-4 py-3 bg-white">
                                <form action="#" >
                                <div class="input-group">
                                    <div type="textbox"  id="messageSenderBox" data-text="Skriv en besked" contentEditable=true aria-describedby="button-addon2" rows="1" class="form-control rounded-0 border-0 py-2 bg-light"></div >
                                    <div class="input-group-append">
                                    <button id="button-addon2" type="submit" class="btn btn-outline-primary send-btn"><i class="fa fa-paper-plane" aria-hidden="true"></i></button>
                                    </div>
                                </div>
                                </form>
                            </div>
                            </div>
                        </div>
                        </main>`;
                        
    function addChatSender(message, userName, date) {
        let dummy = "";
        if (message.length <= 45 )
            dummy = `<div class="dummy-space-left"></div>`

        let resSender = `<div class="media sender-msg mb-3">
        <img src="../pictures/WICKED.png" alt="user" width="50" class="rounded-circle">
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
        if (message.length <= 45 )
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

    let chats = "";

    for (let i = 0; i < 4; i++) {
        if (i % 3)
            chats += addChatReciever("hej", "idag");
        else 
            chats += addChatSender("hej med dig jeg hedder kej", "Ida", "idag");
    }
    for (let i = 0; i < 4; i++) {
        chats += addChatReciever("Test which is a new approach all solutionsTest which is a new approach to have all solutionsTestTest which is a new approach all solutionsTest which is a new approach to have all solutionsTestTest which is a new approach all solutionsTest which is a new approach to have all solutionsTestTest which is a new approach all solutionsTest which is a new approach to have all solutionsTestTest which is a new approach all solutionsTest which is a new approach to have all solutionsTestTest which is a new approach all solutionsTest which is a new approach to have all solutionsTestTest which is a new approach all solutionsTest which is a new approach to have all solutionsTestTest which is a new approach all solutionsTest which is a new approach to have all solutionsTestTest which is a new approach all solutionsTest which is a new approach to have all solutionsTestTest which is a new approach all solutionsTest which is a new approach to have all solutionsTestTest which is a new approach all solutionsTest which is a new approach to have all solutionsTestTest which is a new approach all solutionsTest which is a new approach to have all solutionsTest", "idag");
    }
    for (let i = 0; i < 4; i++) {
        chats += addChatSender("T", "Ida", "idag");
    }


     

    return header+cards+bottomCard+topChat+chats+bottomChat;
}
