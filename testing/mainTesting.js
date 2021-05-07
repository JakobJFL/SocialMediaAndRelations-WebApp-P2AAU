document.getElementById("startTestBtn").addEventListener('click', startTesting);

function startTesting() {
    let obj = {
        psw: "00012345",
        mail: "sent.l@hot-male.com",
        fname: "Sten",
        lname: "Larris",
        study: 1,
        birthDate: "1800-07-20"
    }
    sendGet("makeUser", obj)
}

function sendGet(path, obj) {
    fetch('https://sw2c2-19.p2datsw.cs.aau.dk/node0/' + path)
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
    });
}

function addToOutBox(text) {
    let newDiv = document.createElement("DIV");
    newDiv.innerHTML = text;
    document.getElementById("outputBox").appendChild(newDiv);
}