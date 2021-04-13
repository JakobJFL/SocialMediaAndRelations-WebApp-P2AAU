/* *****************************************************************
  DISCLAIMER: This code is developed to support education and demo 
  purposes and certain simplifications have been made to keep the code
  short and comprehensible.
  ****************************************************************** */

//THIS APP USES ES6 MODULES  
import http from 'http';
import fs from "fs";
import path  from "path";
import process from "process";

//import contentType from "content-type";
//import url from "url";
//import qs from "querystring";
/* ****************************************************************************
 * Application code for the yatzy application 
 ***************************************************************************** */
import {processReq,ValidationError, NoResourceError, AuthError} from "./app.js";
import {login, getGroups, getGroupMembers} from "./database.js";
import {printChatPage} from "./siteChat.js";
export {startServer,extractJSON, extractForm, fileResponse, SSEResponse, broadcastbroadcastAuth, extractJSONAuth, htmlResponse,responseAuth,jsonResponse,errorResponse,reportError};

const port = 3280;
const hostname = "127.0.0.1";
//const serverName="https://sw2c2-19.p2datsw.cs.aau.dk/";

let clientsSSE = [];

/* ***************************************************************************  
  First a number of generic helper functions to serve basic files and documents 
 ***************************************************************************** */ 


/* ***                 Setup Serving of files ***                  */ 

const publicResources="/PublicResources/";
//secture file system access as described on 
//https://nodejs.org/en/knowledge/file-system/security/introduction/
const rootFileSystem=process.cwd();
function securePath(userPath){
  if (userPath.indexOf('\0') !== -1) {
    // could also test for illegal chars: if (!/^[a-z0-9]+$/.test(filename)) {return undefined;}
    return undefined;

  }
  userPath= publicResources+userPath;

  let p= path.join(rootFileSystem,path.normalize(userPath)); 
  //console.log("The path is:"+p);
  return p;
}


/* send contents as file as response */
function fileResponse(res, filename){
  const sPath=securePath(filename);
  //console.log("Reading:"+sPath);
  fs.readFile(sPath, (err, data) => {
    if (err) {
      console.error(err);
      errorResponse(res,404,String(err));
    }else {
      res.statusCode = 200;
      res.setHeader('Content-Type', guessMimeType(filename));
      res.write(data);
      res.end('\n');
    }
  })
}

//A helper function that converts filename suffix to the corresponding HTTP content type
//better alternative: use require('mmmagic') library
function guessMimeType(fileName){
  const fileExtension=fileName.split('.').pop().toLowerCase();
  //console.log(fileExtension);
  const ext2Mime ={ //Aught to check with IANA spec
    "txt": "text/txt",
    "html": "text/html",
    "ico": "image/ico", // CHECK x-icon vs image/vnd.microsoft.icon
    "js": "text/javascript",
    "json": "application/json", 
    "css": 'text/css',
    "png": 'image/png',
    "jpg": 'image/jpeg',
    "wav": 'audio/wav',
    "mp3": 'audio/mpeg',
    "svg": 'image/svg+xml',
    "pdf": 'application/pdf',
    "doc": 'application/msword',
    "docx": 'application/msword'
   };
    //incomplete
  return (ext2Mime[fileExtension]||"text/plain");
}

/* Helper functions to retrieve request objects and send response objects    */  
const InternalError ="Internal Error";

/* send a response with htmlString as html page */
function SSEResponseJson(res, str){
  res.statusCode = 200;
  res.setHeader('Content-Type', "text/event-stream");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Cache-Control", "no-cache");
  res.write(str);
  res.connection.on("end", () => {
    clientsSSE.splice(clientsSSE.indexOf(res), 1);
    res.end();
  });
}

async function SSEResponse(req, res, str) {
  let authheader = req.headers.authorization;
	if (!authheader) 
    errorResponse1(res, 403, "You are not authenticated!");
	let auth = new Buffer.from(authheader.split(' ')[1],'base64').toString().split(':'); // Se her hvis du ikke forstår: https://en.wikipedia.org/wiki/Basic_access_authentication
    let loginData = {
		email: auth[0],
		password: auth[1]
	};
	let loginResult = await login(loginData);
	if (loginResult[0] !== undefined) {
    let clientsSSEObj = {
      SSEreq: req,
      SSEres: res,
      SSEuserID: loginResult[0].user_id
    }
    clientsSSE.push(clientsSSEObj);
    console.log("SSEResponse: "+loginResult[0].user_id);
    SSEResponseJson(res, str);
  }
  else 
    errorResponse1(res, 403, "You are not authenticated!");
}

function htmlResponse(res, htmlString){
  res.statusCode = 200;
  res.setHeader('Content-Type', "text/html");
  res.write(htmlString);
  res.end('\n');
}

function errorResponse1(res, errorCode, msg){
  res.statusCode = errorCode;
  res.setHeader('Content-Type', "text/html");
  res.write("Error:" + errorCode + " | " + msg);
  res.end('\n');
}

async function responseAuth(req, res){
	let authheader = req.headers.authorization;
	if (!authheader) 
    errorResponse1(res, 403, "You are not authenticated!");
	let auth = new Buffer.from(authheader.split(' ')[1],'base64').toString().split(':'); // Se her hvis du ikke forstår: https://en.wikipedia.org/wiki/Basic_access_authentication
    let loginData = {
		email: auth[0],
		password: auth[1]
	};
	let loginResult = await login(loginData);
	if (loginResult[0] !== undefined) {
    printChatPage(loginResult[0].user_id, req.url).then(html => htmlResponse(res, html)).catch(err => console.error(err));
  }
  else 
    errorResponse1(res, 403, "You are not authenticated!");
}

// THIS IS CRAZY
async function broadcastbroadcastAuth(req, res, data) {
  let authheader = req.headers.authorization;
	if (!authheader) 
    errorResponse1(res, 403, "You are not authenticated!");
	let auth = new Buffer.from(authheader.split(' ')[1],'base64').toString().split(':'); // Se her hvis du ikke forstår: https://en.wikipedia.org/wiki/Basic_access_authentication
    let loginData = {
		email: auth[0],
		password: auth[1]
	};
  let loginResult = await login(loginData);
  if (loginResult[0] !== undefined && data.user_id === loginResult[0].user_id) {
    console.log("DATA");
    console.log(req.headers.authorization);
    res.writeHead(200).end();
    let message = "data: " + JSON.stringify(data);
    let event = `event: chat\n${message}\n\n`;
    let groupID = 0;
    getGroups(loginResult[0].user_id).then(groupsData => {
      for (const group of groupsData) {
        if (data.group_id === group.group_id)
          groupID = group.group_id;
      }
      getGroupMembers(groupID).then(groupsMembers=> {
        console.log(groupsMembers);
        for (const client of clientsSSE) {
          console.log(groupsMembers[0].member_id1+"|"+groupsMembers[0].member_id2+"|"+groupsMembers[0].member_id3+"|"+groupsMembers[0].member_id4+"|"+groupsMembers[0].member_id5);
          console.log(client.SSEuserID);
          if (groupsMembers[0].member_id1 === client.SSEuserID || groupsMembers[0].member_id2 === client.SSEuserID || groupsMembers[0].member_id3 === client.SSEuserID || groupsMembers[0].member_id4 === client.SSEuserID || groupsMembers[0].member_id5 === client.SSEuserID) { //auth[0] === loginData.email && auth[1] === loginData.password
            console.log("TRUE"+ client.SSEuserID);
            client.SSEres.write(event);
          }
        }
      });
    });
  }
  else 
    errorResponse1(res, 403, "You are not authenticated!");
}

/* send a response with a given HTTP error code, and reason string */ 
function errorResponse(res, code, reason){
  res.statusCode=code;
  res.setHeader('Content-Type', 'text/txt');
  res.write(reason);
  res.end("\n");
}
/* send 'obj' object as JSON as response */
function jsonResponse(res,obj){
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.write(JSON.stringify(obj));
  res.end('\n');
}

/* As the body of a POST may be long the HTTP modules streams chunks of data
   that must first be collected and appended before the data can be operated on. 
   This function collects the body and returns a promise for the body data
*/

/* protect againts DOS attack from malicious user sending an very very large post body.
if (body.length > 1e7) { 
  // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
  request.connection.destroy();
}
*/
const MessageTooLongError="MsgTooLong";
function collectPostBody(req){
  //the "executor" function
 function collectPostBodyExecutor(resolve,reject){
    let bodyData = [];
    let length=0;
    req.on('data', (chunk) => {
      bodyData.push(chunk);
      length+=chunk.length; 
 
      if(length>10000000) { //10 MB limit!
        req.connection.destroy(); //we would need the response object to send an error code
        reject(new Error(MessageTooLongError));
      }
    }).on('end', () => {
    bodyData = Buffer.concat(bodyData).toString(); //By default, Buffers use UTF8
    //console.log(bodyData);
    resolve(bodyData); 
    });
    //Exceptions raised will reject the promise
  }
  return new Promise(collectPostBodyExecutor);
}

/* extract the enclosed JSON object in body of a POST to JavaScript Object */ 
/* Aught also to check that Content-Type is application/json before parsing*/
async function extractJSONAuth(req){
  let authheader = req.headers.authorization;
  if (!authheader) 
    return Promise.reject(new Error(AuthError)); //create a rejected promise that you are not authenticated
  let auth = new Buffer.from(authheader.split(' ')[1],'base64').toString().split(':'); // Se her hvis du ikke forstår: https://en.wikipedia.org/wiki/Basic_access_authentication
  let loginData = {
		email: auth[0],
		password: auth[1]
	};
  let loginResult = await login(loginData);
  if (loginResult[0] !== undefined) {
    if(isJsonEncoded(req.headers['content-type']))
    return collectPostBody(req).then(body=> {
      let jsonBody = JSON.parse(body);
      console.log(jsonBody)
      if (loginResult[0].user_id == jsonBody.user_id) {
        return jsonBody;
      }
      else {
        return Promise.reject(new Error(AuthError)); //create a rejected promise that you are not authenticated
      }
    });
    else
      return Promise.reject(new Error(ValidationError)); //create a rejected promise
  }
  else 
    return Promise.reject(new Error(AuthError)); //create a rejected promise that you are not authenticated
}

function extractJSON(req){
  if(isJsonEncoded(req.headers['content-type']))
   return collectPostBody(req).then(body=> {
     let jsonBody = JSON.parse(body);
     //console.log(x);
     return jsonBody;
  });
  else
    return Promise.reject(new Error(ValidationError)); //create a rejected promise
}

/* extract the enclosed forms data in the pody of POST */
/* Returns a promise */
function extractForm(req){
  if(isFormEncoded(req.headers['content-type']))
    return collectPostBody(req).then(body=> {
      //const data = qs.parse(body);//LEGACY
       //console.log(data);
       let data=new URLSearchParams(body);
      return data;
      });
  else
    return Promise.reject(new Error(ValidationError));  //create a rejected promise
}

function isFormEncoded(contentType){
  //Format 
  //Content-Type: text/html; charset=UTF-8
  let ctType=contentType.split(";")[0];
  ctType=ctType.trim();
  return (ctType==="application/x-www-form-urlencoded"); 
//would be more robust to use the content-type module and  contentType.parse(..)
//Fine for demo purposes
}

function isJsonEncoded(contentType){
  //Format 
  //Content-Type: application/json; encoding
  let ctType=contentType.split(";")[0];
  ctType=ctType.trim();
  return (ctType==="application/json"); 
//would be more robust to use the content-type module and  contentType.parse(..)
}

function reportError(res,error){
  if(error.message===ValidationError){
    return errorResponse(res,400,error.message);
  }
  if(error.message===NoResourceError){
    return errorResponse(res,404,error.message);
  }
  else {
    console.log(InternalError + ": " +error);
    return errorResponse(res,500,"");
  }
}


/* *********************************************************************
   Setup HTTP server and route handling 
   ******************************************************************** */
const server = http.createServer(requestHandler);
function requestHandler(req,res){
  try{
   processReq(req,res);
  }catch(e){
    console.log(InternalError +"!!: " +e);  
   errorResponse(res,500,"");
  }
}

function startServer(){
 /* start the server */
 server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
  fs.writeFileSync('message.txt', `Server running at http://${hostname}:${port}/`);
 });
}
