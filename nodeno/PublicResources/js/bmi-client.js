'use strict'
//SEE: https://javascript.info/strict-mode


function showDate(data){
    let p=document.getElementById("id1");
    let d=document.createElement("pre");
    d.textContent=String("Fetched date object: "+data);
    p.parentElement.append(d);
   
}


function jsonParse(response){
  if(response.ok) 
     if(response.headers.get("Content-Type") === "application/json") 
       return response.json();
     else throw new Error("Wrong Content Type");   
 else 
    throw new Error("Non HTTP OK response");
}

function jsonFetch(url){
  return  fetch(url).then(jsonParse);
}




function jsonPost(url = '', data={}){
  const options={
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      headers: {
        'Content-Type': 'application/json'
      },
    body: JSON.stringify(data) // body data type must match "Content-Type" header
    };
  return fetch(url,options).then(jsonParse);
}

console.log("JS er klar!");
 
//To demo a small API 
//GET on end-point /bmi-records retrives all records in "DB" as json 
//GET on end-point /bmi-records/{name} retrives the record as json
jsonFetch("bmi-records")
  .then(v=> {console.log("BMI Records"); console.log(v);})
  .catch(e=>console.log("Ooops"+e.message));
//NOT IN SEQUENCE
  jsonFetch("bmi-records/Mickey").then(v=> {console.log("Sample BMI Record"); console.log(v);}).catch(e=>console.log("Ooops"+e.message));


//Test serverside validation!! Anybody can post anything to our server!
jsonPost(document.getElementById("bmiForm_id").action,{name:"BRIAN", weight:-1, height: 888}).then(bmiStatus=>{
  console.log("Status="); console.log(bmiStatus);
}).catch(e=>console.log("SERVER-SIDE VAlidation: PASS "+e.message));
jsonPost(document.getElementById("bmiForm_id").action,{height: 180}).then(bmiStatus=>{
  console.log("Status="); console.log(bmiStatus);
}).catch(e=>console.log("SERVER-SIDE VAlidation: PASS "+e.message));
fetch("html/bmi.html")
  .then(jsonParse)
  .then(bmiStatus=>{console.log("Status="); console.log(bmiStatus);})
  .catch(e=>console.log("Expect wrong content type: "+e.message));


/* In this app we don't use the browsers form submission, but the API defined by the server,
   Hence we extract the values of the input fields of the form and store them in an object, that is
   sent to the server as part of a POST to insert a new record (alse sends updated record back) 
*/ 
function extractBMIData(){
  let bmiData={};
  bmiData.name=document.getElementById("name_id").value;
  bmiData.height=document.getElementById("height_id").value;
  bmiData.weight=document.getElementById("weight_id").value;
  console.log("Extracted"); console.log(bmiData);
  return bmiData;
}

function sendBMI(event) {
  event.preventDefault(); //we handle the interaction with the server rather than browsers form submission
  document.getElementById("submitBtn_id").disabled=true; //prevent double submission
  let bmiData=extractBMIData();
  
  jsonPost(document.getElementById("bmiForm_id").action,bmiData).then(bmiStatus=>{
    console.log("Status="); console.log(bmiStatus);
    let resultElem=document.getElementById("result_id");
    resultElem.textContent=`Hi ${bmiData.name}! Your BMI is ${bmiStatus.bmi}. Since last it has changed ${bmiStatus.delta}!`
    resultElem.style.visibility="visible";
    document.getElementById("submitBtn_id").disabled=false; //prevent double submission
  }).catch(e=>{
    console.log("Ooops "+e.message);
    alert("Encountered Error:" +e.message + "\nPlease retry!");
    document.getElementById("submitBtn_id").disabled=false;
  });
}
//Above we took the action from the form, but we could have set it ourself:. 
//document.getElementById("bmiForm_id").action="/bmi.records";
//document.getElementById("bmiForm_id").method="post";
document.getElementById("bmiForm_id").addEventListener("submit", sendBMI);
