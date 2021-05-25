import {isStrLen, validateEmail, isInteger} from "./app.js";
import {createEventMsg} from "./server.js";
export {runTesting};

function runTesting() {   
    testcreateEventMsg();
    testStrLen();
    testStrLenBad();
    testValidateEmail();
    testValidateEmailBad();
    testIsInteger();
    testIsIntegerBad();
}

function assert(expression, msg) {
    if (!expression) 
        console.error("Error " + msg);
}

function testcreateEventMsg() {
    let actual = {
        test1: 1,
        test2: "This is a string"
    };
    let expected = 'event: chat\ndata: {"test1":1,"test2":"This is a string"}\n\n';
    assert(createEventMsg(actual) === expected, "in testcreateEventMsg");
}

function testStrLen() {
    let testPsw = "0123456789";
    assert(!isStrLen(testPsw, 8, 30), "in testStrLen");
}

function testStrLenBad() {
    let testPsw = "123";
    assert(isStrLen(testPsw, 8, 30), "in testStrLenBad");
    let testPswLong = "1234512345123451234512345123451";
    assert(isStrLen(testPswLong, 8, 30), "in testStrLenBad");
}

function testValidateEmail() {
    let testEmail = "abc@mail.com"
    assert(validateEmail(testEmail) === true, "in testValidateEmail");
}

function testValidateEmailBad() {
    let testEmail = "abcmail.com"
    assert(validateEmail(testEmail) === false, "in testValidateEmailBad");
}

function testIsInteger() {
    let testInt = 1;
    assert(isInteger(testInt) === true, "in testIsInteger");
}

function testIsIntegerBad() {
    let testInt = 2.5;
    assert(isInteger(testInt) === false, "in testIsIntegerBad");
}