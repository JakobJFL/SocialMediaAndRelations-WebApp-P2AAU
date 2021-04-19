document.getElementById("ID of form").addEventListener("submit", sendData); // køre sendData når klikkes på knappen, skriv id af det form eller btn 

function sendData() {
	let coolTing = String(document.getElementById("ID of input").value); // skriv id af det input du vil bruge
	let jsonBody = {
		kat: coolTing,
		kat2: "hello"
	};
  	fetch('https://sw2c2-19.p2datsw.cs.aau.dk/node0/makeUser', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(jsonBody),
    })
    .then(response => response.json())
    .then(jsonData => console.log(jsonData))
	.catch((error) => {
		console.error('Error:', error);
	});
}