//Creates new groups and deletes old groups
//Main call function makeFriends()
import {getAllUserId, createGroup, getAllGroups} from "./database.js";
export {makeFriends};



function makeFriends(){
  getAllUserId()
  .then(userIds =>{
    getAllGroups()
    .then(prevGroups => {
      //console.log(userIds);
      //console.log(prevGroups);
      //console.table(userarray)


      //console.table(prevGroupsArray)
      
      let newGroupArray = genGroups(userIds, prevGroups);

      console.log(newGroupArray); 
      newGroupArray.forEach(groupobject =>{
        createGroup(groupobject)
        .then(console.log("group " + groupobject.member_id1,groupobject.member_id2,groupobject.member_id3,groupobject.member_id4,groupobject.member_id5 + " is created" ))
        .catch(err => console.log(err))
      })
      
    }
     )
    .catch(err => console.log(err))
  })
  .catch(err => console.log(err));
    

}

function genGroups(array, prevGroups){                    //Main function

  let userarray = []
  array.forEach(user =>{
    userarray.push(user.user_id)
  })

  let prevGroupsArray = []                                //Reformats from object to array
  prevGroups.forEach(group =>{
    prevGroupsArray.push([group.member_id1,group.member_id2,group.member_id3,group.member_id4,group.member_id5])
  })

  let groups = [];
  do{
    groups = groupSplit(shuffle(userarray))
    groups = sortGroups(groups);
  }while(checkForDublicates(groups, prevGroupsArray));          //Gennerates groups until all groups are unlike all groups in prevGroups

  let objectGroups = [];
 
  groups.forEach(group =>{
    objectGroups.push({member_id1:group[0],member_id2:group[1],member_id3:group[2],member_id4:group[3],member_id5:group[4]})
  })

  return objectGroups


function shuffle(array) {
    var m = array.length, t, i;

    while (m) {                                           // While there remain elements to shuffle…
  
      i = Math.floor(Math.random() * m--);                // Pick a remaining element randomly
  
      t = array[m];                                       // And swap it with the current element.
      array[m] = array[i];
      array[i] = t;
    }
    return array;
  }

function groupSplit(array){                               //Splits array into groups between 4 and 5          
    let groupsize = 5;                 
    let full = Math.floor(array.length/groupsize);
    let rest = array.length%groupsize;
    let groups = [];
    let group = [];
    let k = 0;

    if(rest == 3){full -= 1; rest += 5}                   //5+3 = 8   //2 groups of 4
    if(rest == 2){full -= 2; rest += 10}                  //10+2 = 12 //3 groups of 4
    if(rest == 1){full -= 3; rest += 15}                  //15+1 = 16 //4 groups of 4

    for(let i = 0; i < full; i++){                        //Splits full size groups
      for(let j = 0; j < groupsize; j++){
        group.push(array[k]);
        k++;
      }
      groups.push(group);
      group = [];
    }

    for(let i = 0; i < rest/4; i++){                      //Splits small size groups
      for(let j = 0; j < 4; j++){
        group.push(array[k]);
        k++;
      }
      groups.push(group);
      group = [];
    }
    return groups;
}

function checkForDublicates(groups, prevGroups){          //Checks for dublicate groups between groups amd prevgroups
  for(let i = 0; i < groups.length; i++){
    for(let j = 0; j < prevGroups.length; j++){
      if (arrayCompare(groups[i], prevGroups[j])) return true;

    }
  } //Måske et strike system
return false;
}

function sortGroups(groups){                              //Sorts the induvidial groups in asending order
  for(let i = 0; i < groups.length; i++){
    QuickSort(groups[i])
  }
  return groups;
}





//Tyv stjålet
function QuickSort(arr, left = 0, right = arr.length - 1) {
  let len = arr.length,
      index
  if(len > 1) {
    index = partition(arr, left, right)
    if(left < index - 1) {
      QuickSort(arr, left, index - 1)
    } 
    if(index < right) {
      QuickSort(arr, index, right)
    }
  }
  return arr
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
  if (arr1.length !== arr2.length) {
      return false;
    }
  
  
  const conarr1 = arr1.concat() // .concat() to not mutate arguments
  const conarr2 = arr2.concat()
  
  for (let i = 0; i < conarr1.length; i++) {
      if (conarr1[i] !== conarr2[i]) {
          return false;
       }
  }
  
  return true;
}
}