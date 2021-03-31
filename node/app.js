
//We use EC6 modules!
import {extractJSON, fileResponse, htmlResponse, jsonResponse, reportError, startServer} from "./server.js";
import {printChatPage} from "./siteChat.js";
import {printLoginPage} from "./siteLogin.js";

const ValidationError="Validation Error";
const NoResourceError="No Such Resource";
export {ValidationError, NoResourceError, processReq};
import mysql from "mysql";
//you may need to: npm install mysql
startServer();

// test DB connection 

//const mysql = require('node_modules/mysql');
/* const DBConnection = mysql.createConnection({
  host: "localhost", 
  user: "sw2c2-19", 
  password: "VCp2rR3zG6msejsZ", 
  database: "sw2c2_19" 
});


DBConnection.connect((err) => {
  if (err) throw err;
  console.log('MySql Connected!');
});
*/

//constants for validating input from the network client
const minLoginLength=1;
const maxLoginLength=50;

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

function validateLoginData(loginData){
  console.log("Validating");
  let email;
  let password;
  try { 
    email = String(loginData.email);
    email = sanitize(email); // Vi skal lige finde ud af om det skal være der
    password = String(loginData.password);
    password = sanitize(password); // Vi skal lige finde ud af om det skal være der

  }catch(e){console.log("Invalid "+e);throw(new Error(ValidationError));}
  
  if((email.length>=minLoginLength) && (email.length<=maxLoginLength) &&
    (password.length>=minLoginLength) && (password.length<=maxLoginLength)) {
    let validloginData={email: loginData.email, password: loginData.password};
    console.log("Validated: "); console.log(validloginData);
    return validloginData;
  } 
  else throw(new Error(ValidationError));

}

/* *********************************************************************
   Setup HTTP route handling: Called when a HTTP request is received 
   ******************************************************************** */
function processReq(req,res){
  //console.log("GOT: " + req.method + " " +req.url);

  let baseURL = 'http://' + req.headers.host + '/';    //https://github.com/nodejs/node/issues/12682
  let url=new URL(req.url,baseURL);
  let searchParms=new URLSearchParams(url.search);
  let queryPath=decodeURIComponent(url.pathname); //Convert uri encoded special letters (eg æøå that is escaped by "%number") to JS string

  switch(req.method){
    case "POST": {
      let pathElements=queryPath.split("/"); 
      console.log(pathElements[1]);
       switch(pathElements[1]){
        case "/login":
        case "login": //just to be nice
          extractJSON(req)
          .then(loginData => validateLoginData(loginData))
          .then(validLoginData => jsonResponse(res,login(validLoginData)))
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
      //console.log(pathElements);
      //USE "sp" from above to get query search parameters
      switch(pathElements[1]){     
        case "": // 
          htmlResponse(res, printLoginPage());
          break;
        case "chat": 
            htmlResponse(res, printChatPage());
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

function login(loginData){
  console.log(loginData);
  
  DBConnection.connect(function(err) {
  if (err) console.log("nejnej err DB connect");
    DBConnection.query("SELECT user_id FROM users WHERE user_mail = " + mysql.escape(loginData.email) + " AND user_psw = " + mysql.escape(loginData.password) , function (err, result, fields) {    
      if(err) console.log("nejnej err SELECT users"); //if (err) throw err;
      else {
        console.log(result);
        return true;
      } 
    });
  });
}