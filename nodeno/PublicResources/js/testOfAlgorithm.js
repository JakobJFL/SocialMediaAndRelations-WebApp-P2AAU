const gruppeSize = 7;

let outputUser = JSON.parse(userTestData);
let users = passToUser(outputUser);

let outputInterests = JSON.parse(commonInterestsData);
let commonInterests = passToInterests(outputInterests);
setUsersInterests(users, commonInterests)

console.log(users);

let groups = makeGroup(users);
console.log(groups);

function passToUser(jsonData) {   
    let users = [];
    for (let i = 0; i < jsonData.data.length; i++) {
        let newUser = new User();
        newUser.id = jsonData.data[i][0];
        newUser.name = jsonData.data[i][1];
        newUser.mail = jsonData.data[i][2];
        newUser.region = jsonData.data[i][3];
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
            let randomIndex = randomIntNum(0, commonInterests.length);
            users[i].interest.push(commonInterests[randomIndex]);
        }
    }
}

function makeGroup(users) {
    let groups = [];
    for (let j = 0; j < gruppeSize; j++) {  
        groups.push(users[j*randomIntNum(0, users.length/gruppeSize)]);
    }
    return groups;
}

function randomIntNum(min, max) {
    return Math.floor(Math.random() * ((max) - min+1)) + min;
}

function User(id, name, mail, region) {
    this.id = id;
    this.name = name;
    this.mail = mail;
    this.region = region;
    this.interest = [];
}

function Interests(id, name, relationX, relationY) {
    this.id = id;
    this.name = name;
    this.relationX = relationX;
    this.relationY = relationY;
}
