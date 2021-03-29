
//We use EC6 modules!
import {extractJSON, fileResponse, htmlResponse,extractForm,jsonResponse,errorResponse,reportError,startServer} from "./server.js";
const ValidationError="Validation Error";
const NoResourceError="No Such Resource";
export {ValidationError, NoResourceError, processReq};
//import mysql from "mysql";
//you may need to: npm install mysql
startServer();
/*
// test DB connection 
//const mysql = require('mysql');
const DBConnection = mysql.createConnection({
  host: 'localhost',
  user: 'p2datsw-staff',
  password: '#############',
  database: 'staff'
});


DBConnection.connect((err) => {
  if (err) throw err;
  console.log('MySql Connected!');
});
*/



/* ***************************************************
 * Application code for the BMI tracker application 
 ***************************************************** */

//constants for validating input from the network client
const maxHeight=300;
const minHeight=1;
const maxWeight=300;
const minWeight=1;
const minNameLength=1;
const maxNameLength=30;

//remove potentially dangerous/undesired characters 
function sanitize(str){
  str=str
.replace(/&/g, "")
.replace(/</g, "")
.replace(/>/g, "")
.replace(/"/g, "")
.replace(/'/g, "")
.replace(/`/g, "")
.replace(/\//g, "");
return str.trim();
}

//function that validates the constraints of the BMIData object
//bmiData must contain valid name,height,weight attributes
function validateBMIData(bmiData){
  console.log("Validating");
  console.log(bmiData);
 
  let name; let nameLen;
  let weight;
  let height;
  try { //ensure that object has name,weight,height properties
    name=String(bmiData.name);
    name=sanitize(name);
    nameLen=name.length;
    weight=parseInt(bmiData.weight);
    height=parseInt(bmiData.height);
  }catch(e){console.log("Invalid "+e);throw(new Error(ValidationError));}
  //ensure correct ranges of values
  if((nameLen>=minNameLength) && (nameLen<=maxNameLength) &&
       (minHeight <= height) && (height <= maxHeight) &&
       (minWeight <= weight) && (weight <=maxWeight)) {
      let validBMIData={name: name, height: height, weight: weight};
      console.log("Validated: "); console.log(validBMIData);
      return validBMIData;
    } 
    else throw(new Error(ValidationError));
}

function round2Decimals(floatNumber){
  return Math.round(floatNumber*100)/100;
}

function calcBMI(height,weight){
  let bmi= weight/(height/100*height/100);
  bmi=round2Decimals(bmi);
  console.log(height, weight,bmi);
  return bmi;
}

/* "Database" emulated by maintained an in-memory array of BMIData objects 
   Higher index means newer data record: you can insert by simply 
  'push'ing new data records */

let sampleBMIData={name: "Mickey", height: 180, weight:90};
let bmiDB=[sampleBMIData]; //


//compare the latest two entries for 'name' and compute difference of bmi numbers
//return 0 if only one or no record is found
//The solution uses C-like JS, and can be simplified using filter and map, indexOf
function calcDelta(name){
  console.log("looking up "+name);
  console.log(bmiDB);
  let newBMIIndex=-1;
  let previousBMIIndex=-1;
  let i=0;

  for(i=bmiDB.length-1; i>=0;i--)
   if(bmiDB[i].name===name) {
     newBMIIndex=i;
     console.log("NEW "+i);
     break;
   } 
 
   for(--i;i>=0;i--) 
     if(bmiDB[i].name===name) {
      previousBMIIndex=i;
      console.log("PREV "+i);
      break;
     } 
   if(newBMIIndex>=0 && previousBMIIndex>=0) 
     return round2Decimals(calcBMI(bmiDB[newBMIIndex].height, bmiDB[newBMIIndex].weight)-
     calcBMI(bmiDB[previousBMIIndex].height, bmiDB[previousBMIIndex].weight));   
   else 
   return 0;
}
//The solution can be simplified using filter and map, indexOf: bmiDB.filter(name).pop().
function bmiLookup(name){
  console.log("looking up "+name);
  let i=0;

  for(i=bmiDB.length-1; i>=0;i--)
   if(bmiDB[i].name===name) {
     return bmiDB[i]; 
  }
  //none found: return an "empty" object 
  return {name:"", height: 0, weight:0}
}

//Process the POST request that adds a new BMI reading to the DB
//It is to return the change in BMI back to the client as a bmiStatus
//object containing the new BMI and delta to the previously store reading (0 if none)
function recordBMI(bmiData){
  console.log(bmiData);
  bmiDB.push(bmiData);
  let bmiStatus={};
  bmiStatus.name=bmiData.name;
  bmiStatus.bmi=calcBMI(bmiData.height, bmiData.weight);
  bmiStatus.delta=calcDelta(bmiData.name);
  console.log(bmiStatus);
  return bmiStatus;
}
/* *********************************************************************
   Setup HTTP route handling: Called when a HTTP request is received 
   ******************************************************************** */
function processReq(req,res){
  console.log("GOT: " + req.method + " " +req.url);

  let baseURL = 'http://' + req.headers.host + '/';    //https://github.com/nodejs/node/issues/12682
  let url=new URL(req.url,baseURL);
  let searchParms=new URLSearchParams(url.search);
  let queryPath=decodeURIComponent(url.pathname); //Convert uri encoded special letters (eg æøå that is escaped by "%number") to JS string

  switch(req.method){
    case "POST": {
      let pathElements=queryPath.split("/"); 
      console.log(pathElements[1]);
       switch(pathElements[1]){
        case "/bmi-records":
        case "bmi-records": //just to be nice
          extractJSON(req)
          .then(bmiData => validateBMIData(bmiData))
          .then(validBmiData => jsonResponse(res,recordBMI(validBmiData)))
          .catch(err=>reportError(res,err));
          break;
        default: 
          console.error("Resource doesn't exist");
          reportError(res, NoResourceError); 
        }
      } 
      break; //POST URL
    case "GET":{
      let pathElements=queryPath.split("/"); 
      console.log(pathElements);
      //USE "sp" from above to get query search parameters
      switch(pathElements[1]){     
        case "": // 
           fileResponse(res,"/html/chatRoom.html");
           break;
        case "date": // 
          let date=new Date();
          console.log(date);
          jsonResponse(res,date);
        break;
        case "bmi-records": 
          if(pathElements.length<=2) // "/bmi-records"
            jsonResponse(res,bmiDB);
          else //"/bmi-records/name"
            jsonResponse(res,bmiLookup(pathElements[2])); 
         break;
         default: //for anything else we assume it is a file to be served
           fileResponse(res, req.url);
         break;
      }//path
    }//switch GET URL
    break;
    default:
     reportError(res, NoResourceError); 
  } //end switch method
}

