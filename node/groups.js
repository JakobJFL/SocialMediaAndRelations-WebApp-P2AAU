//Creates new groups and deletes old groups
//Main call function makeFriends()
import {getAllUserId, createGroup, getAllGroups} from "./database.js";
export {createNewGroups};

const maxRuns = 10;

function createNewGroups() {
	getAllUserId().then(userIds =>{
		getAllGroups().then(prevGroups => {
			let newGroupArray = genGroups(userIds, prevGroups);

			if (!newGroupArray) {
				newGroupArray = genGroups(userIds.reverse(), prevGroups)

				if (!newGroupArray) {
					userIds.forEach(user => {
						user.study = 0;
					});
					newGroupArray = genGroups(userIds, prevGroups)
				}
			}

			if (newGroupArray) {
				for (const groups of newGroupArray) {
					createGroup(groups)
					.then(console.log("group with " + groups.member_id1,groups.member_id2,groups.member_id3,groups.member_id4,groups.member_id5 + " is created" ))
					.catch(err => console.log(err))
				}
			}
			else
				console.error("NO GROUPS CREATED");
		}).catch(err => console.log(err));
	}).catch(err => console.log(err));
}

function genGroups(users, prevGroups) { //Main function
	let prevGroupsArray = []; //Reformats from object to array
	let studyArrays = studySeperation(users); //Seperates array with objects into 2d arrays with first to last study
	let shuffledStudys = [];
	let runs = 0;
	let groups = [];
	prevGroups.forEach(group =>{
		prevGroupsArray.push([group.member_id1, group.member_id2, group.member_id3, group.member_id4, group.member_id5])
	});

	do {
    	groups = [];
    	shuffledStudys = [];
		studyArrays.forEach(study =>{
			shuffledStudys.push(shuffle(study)); //Shuffels every study induvidualy and pushes them to one array
		})

		groups = groupSplit(shuffledStudys); //Splits groups to groups of 5 if possible else groups of 4
		groups = sortGroups(groups); //Sorts induvidual groups in the 2d array to check for dublicates
		groups = removeDublicates(groups, prevGroupsArray);
		runs++;
	} while (checkForDublicates(groups, prevGroupsArray) && runs != maxRuns); //Runs til uniqe groups or maxRuns has been reached

  	if (runs == maxRuns) 
		console.error("MAX RUNS EXCEEDED");
  	else {
		console.log("Runs before uniqe groups found: " + runs);
		let objectGroups = [];
		
		groups.forEach(group => {
			objectGroups.push({
				member_id1: group[0],
				member_id2: group[1],
				member_id3: group[2],
				member_id4: group[3],
				member_id5: group[4]
			});
		});
		return objectGroups;
	}
}
function studySeperation(users) { //Seperates array with objects into 2d arrays with first to last study 
	let userArray = [];
	let allUserArray = [];
	let lookFor = users[0].study;

	for (let i = 0; i < users.length; i++) { //skulle gerne resultere i et array med arrays opdelt efter studie
		if (lookFor == users[i].study)
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
	for(let i = 0; i < shuffledStudys.length; i++)
		usersShuffled = usersShuffled.concat(shuffledStudys[i]);

	let groupsize = 5;              
	let full = Math.floor(usersShuffled.length/groupsize);
	let rest = usersShuffled.length%groupsize;
	let groups = [];
	let group = [];
	let k = 0;

	if(!rest==0){
		full -= (groupsize-rest);
		rest = (groupsize-rest)*(groupsize-1);
	}
	
	for(let i = 0; i < full; i++) { //Splits full size groups
		for(let j = 0; j < groupsize; j++) {
			group.push(usersShuffled[k]);
			k++;
		}
		groups.push(group);
		group = [];
	}

	for(let i = 0; i < rest/4; i++) { //Splits small size groups
		for(let j = 0; j < 4; j++) {
			group.push(usersShuffled[k]);
			k++;
		}
		groups.push(group);
		group = [];
	}
	return groups;
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

function sortGroups(groups) { //Sorts the induvidial groups in asending order
	for(let i = 0; i < groups.length; i++) 
		QuickSort(groups[i])
	return groups;
}

function removeDublicates(groups, prevGroupsArray) {
	for(let i = 0; i < groups.length; i++) {
		if(checkForDublicates([groups[i]], prevGroupsArray)){
			let newGroups = removeDublicatesRek(groups, prevGroupsArray, i, groups[i])
			for(let j = 0; j < newGroups.length; j++) 
				groups[i+j] = newGroups[j];
		}
	}
	return groups;
}   

function removeDublicatesRek(groups,prevGroupsArray,index,dublicateShufflearray) {
	let newGroups = [];
	if(!groups[index+1])
		return false
	
	groups[index+1].forEach(user => {
		dublicateShufflearray.push(user);
	});

	shuffle(dublicateShufflearray);

	newGroups = groupSplit(dublicateShufflearray);								 
	newGroups = sortGroups(newGroups);

	if(checkForDublicates(newGroups, prevGroupsArray))
		unicorn(groups,prevGroupsArray,index+1,dublicateShufflearray);
	return newGroups;
}

function QuickSort(arr, left = 0, right = arr.length - 1) {
	let len = arr.length, index;
	if (len > 1) {
		index = partition(arr, left, right);
		if (left < index - 1) {
		QuickSort(arr, left, index - 1);
		} 
		if (index < right) {
		QuickSort(arr, index, right);
		}
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
			i++
		while(arr[j] > pivot) //Move right pointer to the left until the value at the right is less than the pivot value
			j--

		if (i <= j) { //If  the left pointer is less than or equal to the right pointer, then swap values
			[arr[i], arr[j]] = [arr[j], arr[i]] //ES6 destructuring swap
			i++
			j--
		}
	}
	return i;
}

function arrayCompare(arr1, arr2) { //Checks to make sure a max of 3 groupsmembers have been a groups before 
	let maxAlike = 4; //Max groupmembers in the same group compared to previous groups
	let equals = 0;
	arr1.forEach(num1 => {
		arr2.forEach(num2 => {
		if (num1 == num2) 
			equals++; //Counts the amount of alike in each group
		});
	});
	if (equals < maxAlike) //Returns the result of 
		return false;
	else 
		return true;
}