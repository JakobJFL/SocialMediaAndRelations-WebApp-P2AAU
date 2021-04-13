const gruppeSize = 6;
const numberOfGroups = 5;
const maxInterests = 3;

let outputUser = JSON.parse(userTestData);
let users = passToUser(outputUser);

let outputInterests = JSON.parse(commonInterestsData);
let commonInterests = passToInterests(outputInterests);
setUsersInterests(users, commonInterests)

//console.log(users);
let sortGroups = sortUser(users);
//let groups = makeGroups(sortGroups);
//console.log(sortGroups);

function passToUser(jsonData) {   
    let users = [];
    for (let i = 0; i < jsonData.data.length; i++) {
        let newUser = new User();
        newUser.id = jsonData.data[i][0];
        newUser.name = jsonData.data[i][1];
        newUser.mail = jsonData.data[i][2];
        newUser.fieldsOfStudy = jsonData.data[i][3];
        users.push(newUser);
    }
    return users;
}

function passToInterests(jsonData) {
    let interests = [];
    for (let i = 0; i < jsonData.data.length; i++) {
        let newInterest = new Interests();
        newInterest.id = jsonData.data[i][0];
        newInterest.name = jsonData.data[i][1];
        newInterest.relationX = jsonData.data[i][2];
        newInterest.relationY = jsonData.data[i][3];
        interests.push(newInterest);
    }
    return interests;
}

function setUsersInterests(users, commonInterests) {
    for (let i = 0; i < users.length; i++) {
        for (let j = 0; j < randomIntNum(1, 3); j++) {
            let randomIndex = randomIntNum(0, (commonInterests.length-1));
            users[i].interest.push(commonInterests[randomIndex]);
        }
    }
}

function sortUser(users) {
    let software = [];
    let datalogi = [];
    let kemiTeknologi = [];
    let bioTeknologi = [];

    for (let i = 0; i < users.length; i++) {
        //console.log(users[i].fieldsOfStudy);
        switch (users[i].fieldsOfStudy) {
            case "Software":
                software.push(users[i])
                break;
            case "Datalogi":
                datalogi.push(users[i])
                break;
            case "Kemiteknologi":
                kemiTeknologi.push(users[i])
                break;
            case "Bioteknologi":
                bioTeknologi.push(users[i])
                break;
        
            default:
                break;
        }
    }
    let groups = makeGroups(software, datalogi, kemiTeknologi, bioTeknologi)
    return groups;
}

function makeGroups(software, datalogi, kemiTeknologi, bioTeknologi) {
    let groups = [];
    let softwareGroupAmount = software.length/numberOfGroups;
    let datalogiGroupAmount = datalogi.length/numberOfGroups;
    let kemiGroupAmount = kemiTeknologi.length/numberOfGroups;
    let bioGroupAmount = bioTeknologi.length/numberOfGroups;


    getDistance(software);

    for (let i = 0; i < softwareGroupAmount; i++){
        groups.push(makeGroup(software));
    }
    for (let i = 0; i < datalogiGroupAmount; i++){
        groups.push(makeGroup(datalogi));
    }
    for (let i = 0; i < kemiGroupAmount; i++){
        groups.push(makeGroup(kemiTeknologi));
    }
    for (let i = 0; i < bioGroupAmount; i++){
        groups.push(makeGroup(bioTeknologi));
    }

    return groups;  
}

function makeGroup(users){
    let group = [];
    let id = 0;
    for (let j = 1; j < gruppeSize; j++) {  
        id = randomIntNum(0, (users.length-1));
        group.push(users[id]);
        users.splice(id, 1);
        //console.log(users);
    }
    return group;
}

function randomIntNum(min, max) {
    return Math.floor(Math.random() * ((max) - min+1)) + min;
}

function getDistance(users) {
    let dist = [];
    let person = [];
    for (let i = 0; i < users.length; i++) {
        for (let j = 0; j < maxInterests; j++) {
            if (users[i].interest[j] == undefined) {
                break;
            }
            else {
                for (let k = i+1; k < users.length; k++) {
                    for(let l = 0; l < maxInterests; l++) {
                        if (users[k].interest[l] == undefined) {
                            break;
                        }
                        else {
                            x1 = users[i].interest[j].relationX;
                            y1 = users[i].interest[j].relationY;
                            x2 = users[k].interest[l].relationX;
                            y2 = users[k].interest[l].relationY;
                            dist.push(Math.hypot(x2-x1, y2-y1));
                            person.push(dist);
                        }
                    }
                }
            }
        }
        //bubbleSort(dist);
        dist = [];
        //console.log(users[i].id);
    }
    //console.log(person);
    //let ass = bubbleSort(person);
    console.log(person);
    return dist;
}

function bubbleSort(inputArr) {
    let len = inputArr.length;
    let checked;
    do {
        checked = false;
        for (let i = 0; i < len; i++) {
            if (inputArr[i] > inputArr[i + 1]) {
                let tmp = inputArr[i];
                inputArr[i] = inputArr[i + 1];
                inputArr[i + 1] = tmp;
                checked = true;
            }
        }
    } while (checked);
    return inputArr;
}

function User(id, name, mail, fieldsOfStudy) {
    this.id = id;
    this.name = name;
    this.mail = mail;
    this.fieldsOfStudy = fieldsOfStudy;
    this.interest = [];
}

function Interests(id, name, relationX, relationY) {
    this.id = id;
    this.name = name;
    this.relationX = relationX;
    this.relationY = relationY;
}