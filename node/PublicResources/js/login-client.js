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

    fetch('http://127.0.0.1:3280/login', {
        method: 'POST', // or 'PUT'
        headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(loginData),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:');
    })
    .catch((error) => {
        console.error('Error:', error);
    });
    
  }

document.getElementById("loginBtn").addEventListener("submit", sendLoginData);


