getProfileData = function(){
    let profileData={};
    profileData.name=String(document.getElementById("inputName").value);
    profileData.dateOfBirth=String(document.getElementById("inputDateOfBirth").value);
    profileData.email=String(document.getElementById("inputEmail").value);
    profileData.fieldsOfStudy=String(document.getElementById("inputFieldsOfStudy").value);
    profileData.interests1=String(document.getElementById("inputInterests1").value);
    profileData.interests2=String(document.getElementById("inputInterests2").value);
    profileData.interests3=String(document.getElementById("inputInterests3").value);
    console.log(JSON.stringify(profileData));

    return profileData;
}