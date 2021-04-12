let A = [4];

A[0] = 10.00; //Software - studieretning (x-koordinat)
A[1] = 0.10; // Sidst online - 1 time siden (y-koordinat)
A[2] = 0.022; // 1. interesse - Teknologi - programmering (z-koordinat)
A[3] = 0.091; // 2. interesse - Udeliv - sejllads (v-koordinat)
A[4] = 0.058; // 3. interesse - Underholdning - Gaming (w-koordinat)

let B = [4];

B[0] = 20.00; //Datalogi - studieretning
B[1] = 0.40; // Sidst online - 4 timer siden
B[2] = 0.022; // 1. interesse - Teknologi - programmering
B[3] = 0.095; // 2. interesse - Udeliv - Løbe
B[4] = 0.059; // 3. interesse - Underholdning - E-sport

let C = [4];

C[0] = 30.00; //Kemiteknologi - studieretning
C[1] = 2.0; // Sidst online - 20 timer siden
C[2] = 0.029; // 1. interesse - Teknologi - smartphone
C[3] = 0.095; // 2. interesse - Udeliv - Løbe
C[4] = 0.051; // 3. interesse - Underholdning - madlavning


//  for (i = 0; i < 5; i++)
//      dist = getDistance(A[i] to B[i])
//  return dist

function getDistance() {
    let sum = 0;
    for (let i = 1; i < A.length-1; i++) {
        sum += Math.pow(vecNum2 - vecNum1, 2);
    }
}

gettime();

function gettime() {

    let timeNow = Math.round(Date.now() / 1000)
    let userLastOnline = 16170000;

    let diff = (timeNow - userLastOnline) / 3600;
    console.log(diff);

    if(diff > 1440){
        val = 1.0
    }
    else if(diff > 720){
        val = 0.9
    }
    else if(diff > 340){
        val = 0.6
    }
    else if(diff > 300){
        val = 0.5
    }
    else if(diff > 240){
        val = 0.4
    }
    else if(diff > 160){
        val = 0.3
    }
    else if(diff > 60){
        val = 0.2
    }
    else if(diff < 60){
        val = 0.1
    }  

    console.log(val);
}

