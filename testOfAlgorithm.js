
addUsers();

function User(id, firstName, gender, city, education, activityScore) {
    this.id = id;
    this.firstName = firstName;
    this.gender = gender;
    this.city = city;
    this.education = education;
    this.activityScore = activityScore;
}

function addUsers() {
    let firstNames = ["Goldie", "Olive", "Chelsea", "Nada","Mathew", "Fremont", "Viva", "Kenyon", "Renaldo", "Ami"];
    let user = [];
    for (let i = 0; i < 10; i++) {
        let newUser = new User();
        
        newUser.id = i;
        newUser.education = "Software";
        newUser.firstName = firstNames[i];
        if (i % 2) 
            newUser.gender = "Female";
        else 
            newUser.gender = "Male";

        newUser.city = "Aalborg";
        newUser.activityScore = 0;

        user.push(newUser);
    }

    console.log(user);
}

