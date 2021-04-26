//Creates new groups and deletes old groups
//Main call function makeFriends()

import {getAllUserId, createGroup, getAllGroups} from "./database.js";
export {makeFriends, genGroups};


function makeFriends(){
  getAllUserId()
  .then(userIds =>{
    getAllGroups()
    .then(prevGroups => {
      
      let newGroupArray = genGroups(userIds, prevGroups);
      
      console.log(newGroupArray); 

      newGroupArray.forEach(groupobject =>{
        createGroup(groupobject)
        .then(console.log("group with " + groupobject.member_id1,groupobject.member_id2,groupobject.member_id3,groupobject.member_id4,groupobject.member_id5 + " is created" ))
        .catch(err => console.log(err))
      });
    })
    .catch(err => console.log(err));
  })
  .catch(err => console.log(err));
}

function genGroups(users, prevGroups){                          //Main function


  let prevGroupsArray = []                                      //Reformats from object to array
  prevGroups.forEach(group =>{
    prevGroupsArray.push([group.member_id1,group.member_id2,group.member_id3,group.member_id4,group.member_id5])
  })
  console.table(users);

  let studyArrays = studySeperation(users);
  let shuffledStudys = [];
  let runs = 0;
  let groups = [];

  console.table(studyArrays);

  do{
    studyArrays.forEach(study =>{
      shuffledStudys.push(shuffle(study));
    })
    groups = groupSplit(shuffledStudys);
    groups = sortGroups(groups);
    console.log(groups);
    runs++;
  }while(checkForDublicates(groups, prevGroupsArray)); 

  console.log("Runs before uniqe groups found: " + runs);
  let objectGroups = [];
 
  groups.forEach(group =>{
    if(!group[4]){
      group[4] = 0;
    }
    objectGroups.push({member_id1:group[0],member_id2:group[1],member_id3:group[2],member_id4:group[3],member_id5:group[4]})
  })
  return objectGroups;

function studySeperation(users){                //O(n)

  let userArray = [];
  let allUserArray = [];
  let lookFor = users[0].study;


  for(let i = 0; i < users.length; i++){                     //skulle gerne resultere i et array med arrays opdelt efter studie
    if(lookFor == users[i].study){
      userArray.push(users[i].user_id);
    }

    else{
      allUserArray.push(userArray);
      userArray = [];
      userArray.push(users[i].user_id);

      if(users[i+1]){
        lookFor = users[i+1].study;
      };
    };
  };
allUserArray.push(userArray);  

return allUserArray;
}


function shuffle(array) {                                      //O(n)
    let m = array.length, t, i;

    while (m) {                                               // While there remain elements to shuffle
      i = Math.floor(Math.random() * m--);                    // Pick a remaining element randomly
  
      t = array[m];                                           // And swap it with the current element.
      array[m] = array[i];
      array[i] = t;
    }
    return array;
  }

function groupSplit(shuffledStudys){                                   //Splits array into groups between 4 and 5    
  
  let usersShuffled = [];
  for(var i = 0; i < shuffledStudys.length; i++)
  {
      usersShuffled = usersShuffled.concat(shuffledStudys[i]);
  }

    let groupsize = 5;                 
    let full = Math.floor(usersShuffled.length/groupsize);
    let rest = usersShuffled.length%groupsize;
    let groups = [];
    let group = [];
    let k = 0;

    if(rest == 3){full -= 1; rest += 5}                       //5+3 = 8   //2 groups of 4
    if(rest == 2){full -= 2; rest += 10}                      //10+2 = 12 //3 groups of 4
    if(rest == 1){full -= 3; rest += 15}                      //15+1 = 16 //4 groups of 4

    for(let i = 0; i < full; i++){                            //Splits full size groups
      for(let j = 0; j < groupsize; j++){
        group.push(usersShuffled[k]);
        k++;
      }
      groups.push(group);
      group = [];
    }

    for(let i = 0; i < rest/4; i++){                          //Splits small size groups
      for(let j = 0; j < 4; j++){
        group.push(usersShuffled[k]);
        k++;
      }
      groups.push(group);
      group = [];
    }
    return groups;
}

function checkForDublicates(groups, prevGroups){              //Checks for dublicate groups between groups amd prevgroups
  for(let i = 0; i < groups.length; i++){
    for(let j = 0; j < prevGroups.length; j++){
      if (arrayCompare(groups[i], prevGroups[j])) return true;

    }
  }
return false;
}

function sortGroups(groups){                                  //Sorts the induvidial groups in asending order
  for(let i = 0; i < groups.length; i++){
    QuickSort(groups[i])
  }
  return groups;
}


function QuickSort(arr, left = 0, right = arr.length - 1) {
  let len = arr.length, index;
  if(len > 1) {
    index = partition(arr, left, right);
    if(left < index - 1) {
      QuickSort(arr, left, index - 1);
    } 
    if(index < right) {
      QuickSort(arr, index, right);
    }
  }
  return arr;
}

function partition(arr, left, right) {
  let middle = Math.floor((right + left) / 2),
      pivot = arr[middle],
      i = left,                             // Start pointer at the first item in the array
      j = right                             // Start pointer at the last item in the array

  while(i <= j) {
    while(arr[i] < pivot) {                 // Move left pointer to the right until the value at the left is greater than the pivot value
      i++
    }
    while(arr[j] > pivot) {                 // Move right pointer to the left until the value at the right is less than the pivot value
      j--
    }

    if(i <= j) {                            // If the left pointer is less than or equal to the right pointer, then swap values
      [arr[i], arr[j]] = [arr[j], arr[i]]   //ES6 destructuring swap
      i++
      j--
    }
  }
  return i
}

function arrayCompare(arr1, arr2) {
  let equals = 0;
  arr1.forEach(num1 => {
    arr2.forEach(num2 => {
      if(num1 === num2){
        equals++
      };
    });
  });

  if(equals <= 4){
    return false;
  }
  else{
    return true;
  }
}
}


