const gruppeSize = 5;
const numberOfGroups = 5;
const maxInterests = 3;

let outputUser = JSON.parse(userTestData);
let users = passToUser(outputUser);

let outputInterests = JSON.parse(commonInterestsData);
let commonInterests = passToInterests(outputInterests);
setUsersInterests(users, commonInterests)

console.log(users);
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
        newInterest.relation = jsonData.data[i][2];
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
    console.log(software);
    return groups;
}

function makeGroups(software, datalogi, kemiTeknologi, bioTeknologi) {
    let groups = [];
    let softwareGroupAmount = software.length/numberOfGroups;
    let datalogiGroupAmount = datalogi.length/numberOfGroups;
    let kemiGroupAmount = kemiTeknologi.length/numberOfGroups;
    let bioGroupAmount = bioTeknologi.length/numberOfGroups;


    software = getDistance(software);
    //datalogi = getDistance(datalogi);
    //kemiTeknologi = getDistance(kemiTeknologi);
    //bioTeknologi = getDistance(bioTeknologi);

        groups.push(makeGroup(software));
        //groups.push(makeGroup(datalogi));
        //groups.push(makeGroup(kemiTeknologi));
        //groups.push(makeGroup(bioTeknologi));

    return groups;  
}

function makeGroup(users) {
    let group = [];
    let person = [];
    for (let i = 1; i < 6; i++) {
        //group.push(users.user1ID[i]);
        for (let j = 1; j < gruppeSize; j++) {
            person[j] = users.user2ID[j]
            //console.log(users);
        }
        person.push(users.user1ID[1]);
        group.push(person);
        person = [];
        


        
        
        
        
        
        //console.log(users.user1ID);
        //let thicc1 = users.user1ID;
        //let thicc2 = users.user2ID;
        //let thicc3 = users.distInterests;
        /*for (let o = 0; o < group.length; o++) {
            for (let l = 1; l < gruppeSize; l++) {
                for (let k = 0; k < users.user1ID.length; k++) {
                    if (group[o][l] === users.user1ID[k]) {
                        thicc1.splice(k, 1);
                        //thicc2.splice(k, 1);
                        //thicc3.splice(k, 1);
                    }
                }
            }
        }*/
        //users.user1ID = thicc1;
        //users.user2ID = thicc2;
        //users.distInterests = thicc3;
        //console.log(users.user1ID);
        //console.log(users.user1ID);
    }


    /*const index = array.indexOf(5);
    if (index > -1) {
    array.splice(index, 1);*/
    
    /*let array = [1, 2, 2, 3, 4, 5, 5, 6, 1, 7];
    for (let k = 1; k < array.length; k++) {
        let index = array.indexOf(k);

        array.splice(index, 1);
        
        console.log(array);
    } */
    
    return group;
}

function randomIntNum(min, max) {
    return Math.floor(Math.random() * ((max) - min+1)) + min;
}

function getDistance(users) {
    let dist = {
        user1ID: [],
        user2ID: [],
        distInterests: []
    };
    //let person = [];
    let interest1 = [];
    let interest2 = [];

    for (let i = 0; i < users.length; i++) {
        for (let k = i+1; k < users.length; k++) {
            for (let j = 0; j < maxInterests; j++) {
                if (users[i].interest[j] == undefined) {
                    interest1[j] = 0;
                }
                else {
                    interest1[j] = users[i].interest[j].relation;
                }
                if (users[k].interest[j] == undefined) {
                    interest2[j] = 0;
                }
                else {
                    interest2[j] = users[k].interest[j].relation;
                }
            }
            dist.user1ID.push(users[i].id);
            dist.user2ID.push(users[k].id);
            dist.distInterests.push(Math.hypot(interest2[0]-interest1[0], interest2[1]-interest1[1], interest2[2]-interest1[2]));
        }
        //person.push(dist);
        //dist = [];
        //console.log(users[i].id);
    }
    console.log(users[0].id, users[0].interest);
    console.log(users[16].id, users[16].interest);
    bubbleSort(dist.distInterests, dist.user1ID, dist.user2ID);
    bubbleSort(dist.user1ID, dist.distInterests, dist.user2ID);
    //console.log(person);
    console.log(dist);
    return dist;
}

function bubbleSort(inputArr, ID1, ID2) {
    let len = inputArr.length;
    let checked;
    do {
        checked = false;
        for (let i = 0; i < len; i++) {
            if (inputArr[i] > inputArr[i + 1]) {
                let tmp = inputArr[i];
                inputArr[i] = inputArr[i + 1];
                inputArr[i + 1] = tmp;

                let tmpID1 = ID1[i];
                ID1[i] = ID1[i + 1];
                ID1[i + 1] = tmpID1;

                let tmpID2 = ID2[i];
                ID2[i] = ID2[i + 1];
                ID2[i + 1] = tmpID2;

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

function Interests(id, name, relation) {
    this.id = id;
    this.name = name;
    this.relation = relation;
}