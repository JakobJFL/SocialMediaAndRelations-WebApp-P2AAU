//Creates new groups and deletes old groups
//Main call function makeFriends()
import {getAllUserId, createGroup, getAllGroups, deleteGroup} from "./database.js";
import {groupSize} from "./app.js";
export {createNewGroups};
const maxRuns = 10;
const msIn5Days = 432000000;

function createNewGroups() {
	getAllUserId().then(userIds =>{
		getAllGroups().then(prevGroups => {
			let newGroupArray = genGroups(userIds, prevGroups);
			if(checkIfEnoughUsers(userIds.length)) {
				if (!newGroupArray) {
					newGroupArray = genGroups(userIds.reverse(), prevGroups);
					if (!newGroupArray) {
						userIds.forEach(user => {
							user.study = 0;
						});
						newGroupArray = genGroups(userIds, prevGroups);
					}
				}
				console.log(newGroupArray);
			}
			if (newGroupArray) 
				insertGroupsDB(newGroupArray);
			else
				console.error("NO GROUPS CREATED");
			
			deleteInactiveGroups(prevGroups); //Delete old inactive groups
		}).catch(err => console.log(err));
	}).catch(err => console.log(err));
}


function checkIfEnoughUsers(length){
    if(length < (groupSize-1)*4){
        console.error("Not enough users for groups");
        return false;
    }
	else
		return true
}

function genGroups(users, prevGroups) { //Main function to gennerate groups
	let studyArrays = studySeperation(users); //Seperates array with objects into 2d arrays with first to last study
	let shuffledStudys = [];
	let runs = 0;
	let groups;
	let prevGroupsArray = ArrOfObjToArr2D(prevGroups);

	do {
    	groups = [];
    	shuffledStudys = [];
		studyArrays.forEach(study =>{
			shuffledStudys.push(shuffle(study)); //Shuffels every study induvidualy and pushes them to one array
		});
		groups = groupSplit(shuffledStudys); //Splits groups to groups of 5 if possible else groups of 4
		groups = sortGroups(groups); //Sorts induvidual groups in the 2d array to check for dublicates
		runs++;
	} while (checkForDublicates(groups, prevGroupsArray) && runs != maxRuns); //Runs til unique groups or maxRuns has been reached

  	if (runs === maxRuns) 
		console.error("MAX RUNS EXCEEDED");
  	else {
		console.log("Runs before unique groups found: " + runs);
		return arr2DToArrOfObj(groups);
	}
}

function studySeperation(users) { //Seperates array with objects into 2d arrays with first to last study 
	let userArray = [];
	let allUserArray = [];
	let lookFor = users[0].study;

	for (let i = 0; i < users.length; i++) { //skulle gerne resultere i et array med arrays opdelt efter studie
		if (lookFor === users[i].study)
			userArray.push(users[i].user_id);
		else {
			allUserArray.push(userArray);
			userArray = [];
			userArray.push(users[i].user_id);

			if (users[i+1]) 
				lookFor = users[i+1].study;
		}
	}
	allUserArray.push(userArray);  
	return allUserArray;
}

function ArrOfObjToArr2D(prevGroups) {
	let prevGroupsArray = [];
	for(let i = 0; i < prevGroups.length; i++){
		let steparr = []; 
		for (let j = 0; j < groupSize; j++) {
			let key = "member_id"+(j+1); 
			steparr[j] = prevGroups[i][key];
		}
		prevGroupsArray.push(steparr);
	}
	return prevGroupsArray;
}

function shuffle(array) { //Fisher-Yates shuffle
	let m = array.length, t, i;
	while (m) { // While there remain elements to shuffle
		i = Math.floor(Math.random() * m--); // Pick a remaining element randomly
		t = array[m]; // And swap it with the current element.
		array[m] = array[i];
		array[i] = t;
	}
	return array;
}

function groupSplit(shuffledStudys) { //Splits array into groups between 4 and 5    
	let usersShuffled = [];
	let pos = 0;
	let groups = [];

	for(let i = 0; i < shuffledStudys.length; i++)
		usersShuffled = usersShuffled.concat(shuffledStudys[i]);
		
	let rest = usersShuffled.length%groupSize;
	let full = Math.floor(usersShuffled.length/groupSize);

	if(!rest==0) {
		full -= (groupSize-rest);
		full += 1;
		rest = (groupSize-rest)*(groupSize-1);
	}

	groups = toGroupArrBySize(groups, full, groupSize, usersShuffled, pos);//Splits full size groups
	groups = toGroupArrBySize(groups,rest/(groupSize-1), groupSize-1, usersShuffled, groups.length*groupSize);
	return groups;
}

function toGroupArrBySize(groups, runTo, sizeOfGroup, usersArr, pos) {
	for (let i = 0; i < runTo; i++) { 
		let group = [];
		for(let j = 0; j < sizeOfGroup; j++) {
			group.push(usersArr[pos]);
			pos++;
		}
		groups.push(group);
	}
	return groups;
}

function sortGroups(groups) { //Sorts the induvidial groups in asending order
	for(let i = 0; i < groups.length; i++) 
		QuickSort(groups[i]);
	return groups;
}

function QuickSort(arr, left = 0, right = arr.length - 1) {
	let len = arr.length;
	let index;
	if (len > 1) {
		index = partition(arr, left, right);
		if (left < index - 1) 
			QuickSort(arr, left, index - 1);
		if (index < right) 
			QuickSort(arr, index, right);
	}
	return arr;
}

function partition(arr, left, right) {
	let middle = Math.floor((right + left) / 2);
	let	pivot = arr[middle];
	let	i = left; //Start pointer at the first item in the array
	let	j = right; //Start pointer at the last item in the array

	while(i <= j) {
		while(arr[i] < pivot) //Move left pointer to the right until the value at the left is greater than the pivot value
			i++;
		while(arr[j] > pivot) //Move right pointer to the left until the value at the right is less than the pivot value
			j--;

		if (i <= j) { //If the left pointer is less than or equal to the right pointer, then swap values
			[arr[i], arr[j]] = [arr[j], arr[i]]; //ES6 destructuring swap
			i++;
			j--;
		}
	}
	return i;
}

function checkForDublicates(groups, prevGroups) { //Checks for dublicate groups between groups amd prevgroups
	for(let i = 0; i < groups.length; i++) {
		for(let j = 0; j < prevGroups.length; j++) {
			if (arrayCompare(groups[i], prevGroups[j])) 
				return true;
		}
	}
	return false;
}

function arrayCompare(arr1, arr2) { //Checks to make sure a max of 3 groupsmembers have been a groups before 
	let maxAlike = 4; //Max groupmembers in the same group compared to previous groups
	let equals = 0;
	arr1.forEach(num1 => {
		arr2.forEach(num2 => {
		if (num1 === num2) 
			equals++; //Counts the amount of alike in each group
		});
	});
	if (equals < maxAlike) //Returns the result of 
		return false;
	else 
		return true;
}


function arr2DToArrOfObj(ArrOfObj) {
	let objectArr = [];
	for (let i = 0; i < ArrOfObj.length; i++) {
		let object = {};
		for (let j = 0; j < groupSize; j++) {
			let key = "member_id"+(j+1); 
			object[key] = ArrOfObj[i][j];
		}
		objectArr.push(object);
	}
	return objectArr;
}

function insertGroupsDB(groupArray) {
	for (const groups of groupArray) {
		createGroup(groups).catch(err => console.error(err));
	}
	console.log("groups createt");
}

function deleteInactiveGroups(groups) {	
	let newD = new Date();
	let timeNow = newD.getTime();
	let groupsToDelete = [];
	for (const group of groups) {
		let DBdateGro = convertDBTime(group.gTime);
		let DBdateMsg = convertDBTime(group.mTime);

		if (DBdateMsg) {
			if (timeNow-msIn5Days > DBdateMsg) //checks if group has send messeage in specified period
				groupsToDelete.push(group.group_id);
		}
		else if (timeNow-msIn5Days > DBdateGro) //if no messages is found checks age of group
			groupsToDelete.push(group.group_id);
	}
	for (const group of groupsToDelete) {
		deleteGroup(group);
	}
	console.log(groupsToDelete.length + " groups deleted")
}

function convertDBTime(time) {
	if (time) {
		let DBdate = String(time).split(/[- :]/);
		return new Date(DBdate[2] + " " + DBdate[1] + " " + DBdate[3] + " " + DBdate[4] + ":" + DBdate[5]).getTime();
	}
	else 
		return undefined;
}