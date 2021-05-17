import {isStrLen, validateEmail} from "./app.js";
import {createEventMsg} from "./server.js";
export {runTesting};

function runTesting() {    
    testcreateEventMsg();
    testStrLen();
    testStrLenBad();
    testValidateEmail();
    testValidateEmailBad();
}

function assert(expression, msg) {
    if (expression) {
        console.error("Error " + msg);
    }
    else {
        console.log("The formatting is correct");
    }
}

function testcreateEventMsg() {
    let dataStr = {
        test1: 1,
        test2: "This is a string"
    };
    let EdataStr = 'event: chat\ndata: {"test1":1,"test2":"This is a string"}\n\n'
    console.log(createEventMsg(dataStr));
    assert(createEventMsg(dataStr) !== EdataStr, "in testcreateEventMsg");
}

function testStrLen() {
    let testPsw = "0123456789";
    console.log("Password: " + testPsw);
    console.log("Is there an error? " + isStrLen(testPsw, 8, 30));
    assert(isStrLen(testPsw, 8, 30), "in testStrLen");
}

function testStrLenBad() {
    let testPsw = "123";
    console.log("Password: " + testPsw);
    console.log("Is there an error? " + isStrLen(testPsw, 8, 30));
    assert(isStrLen(testPsw, 8, 30), "in testStrLenBad");
    
    let testPswLong = "1234512345123451234512345123451";
    console.log("PasswordLong: " + testPswLong);
    console.log("Is there an error? " + isStrLen(testPswLong, 8, 30));
    assert(isStrLen(testPswLong, 8, 30), "in testStrLenBad");
}

function testValidateEmail() {
    let testEmail = "abc@mail.com"
    console.log("Email: " + testEmail);
    assert(validateEmail(testEmail) === false, "in testValidateEmail");
}

function testValidateEmailBad() {
    let testEmail = "abcmail.com"
    console.log("Email: " + testEmail);
    assert(validateEmail(testEmail) === false, "in testValidateEmailBad");
}