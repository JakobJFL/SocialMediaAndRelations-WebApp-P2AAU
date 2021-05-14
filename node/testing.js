import {createEventMsg} from "./server.js";
export {runTesting};

function runTesting() {
    let dataStr = {
        kat: "kat",
        mua: "lol"
    };
    let EdataStr = "";
    console.log(createEventMsg(dataStr));
    assert(createEventMsg(dataStr) === EdataStr);
}

function assert(expression, msg) {
    if (!expression) {
        throw Error(msg + "expression: " + msg);
    }
}