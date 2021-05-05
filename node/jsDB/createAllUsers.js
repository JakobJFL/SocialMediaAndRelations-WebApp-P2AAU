import {createUser} from "./database.js";
export {createAllNewUsers};





function createAllNewUsers(){
    //max is determined by emails and names arrays
    let newusers = 100;
    let startfrom = 0;
    let study = 1;

    let allUsers = [];

    //let emails = ["knie20@mail.com","jakob@mail.com","hahadethererikkeminemail@yahoo.com","Shortlegs@Longarms.yes", "peter@mail.com", "Danni@mail.dk"]
    //let names  = ["Kasper","Jakob","Patrick","Martin", "peter", "Danni"]
    let emails = ["knie20@mail.com","jakob@mail.com","hahadethererikkeminemail@yahoo.com","Shortlegs@Longarms.yes", "peter@mail.com", "Danni@mail.dk","skippy@comcast.net","ilikered@optonline.net","jfmulder@optonline.net","airship@yahoo.ca","stefano@hotmail.com","shang@verizon.net","ducasse@att.net","ewaters@icloud.com","hampton@yahoo.ca","goresky@verizon.net","microfab@outlook.com","credmond@outlook.com","nicktrig@sbcglobal.net","parksh@yahoo.ca","stakasa@verizon.net","zilla@verizon.net","lahvak@me.com","jsbach@live.com","kobayasi@sbcglobal.net","sjmuir@optonline.net","dwsauder@icloud.com","payned@live.com","jsnover@yahoo.com","oracle@hotmail.com","snunez@icloud.com","dinther@icloud.com","sriha@msn.com","jrkorson@icloud.com","flavell@icloud.com","lishoy@hotmail.com","fluffy@gmail.com","esokullu@msn.com","dbindel@att.net","hedwig@att.net","jsmith@icloud.com","rbarreira@outlook.com","scato@outlook.com","sokol@gmail.com","spadkins@mac.com","william@aol.com","jginspace@outlook.com","dwendlan@comcast.net","dmbkiwi@att.net","konst@sbcglobal.net","itstatus@yahoo.ca","benanov@yahoo.ca","wagnerch@aol.com","gommix@optonline.net","mjewell@verizon.net","cisugrad@gmail.com","ubergeeb@verizon.net","ismail@mac.com","slaff@yahoo.ca","scottlee@me.com","tmccarth@mac.com","fviegas@att.net","eabrown@icloud.com","retoh@gmail.com","nacho@me.com","eminence@mac.com","lipeng@icloud.com","fangorn@live.com","purvis@outlook.com","marcs@yahoo.com","andrewik@optonline.net","nighthawk@me.com","horrocks@gmail.com","elflord@gmail.com","leviathan@me.com","alfred@msn.com","benits@me.com","starstuff@hotmail.com","aracne@verizon.net","geekoid@verizon.net","ducasse@yahoo.ca","ideguy@gmail.com","sarahs@aol.com","ivoibs@gmail.com","pgottsch@gmail.com","mchugh@verizon.net","khris@gmail.com","mnemonic@hotmail.com","jfmulder@hotmail.com","epeeist@aol.com","jyoliver@yahoo.ca","eimear@mac.com","donev@aol.com","tbmaddux@mac.com","miturria@me.com","peterhoeg@live.com","frederic@yahoo.ca","punkis@mac.com","treit@optonline.net","camenisch@me.com","campbell@verizon.net","kildjean@msn.com","geoffr@yahoo.com","trygstad@aol.com","miturria@mac.com","sjmuir@aol.com","danneng@yahoo.ca","ghaviv@hotmail.com","vertigo@mac.com","adhere@yahoo.ca","nighthawk@hotmail.com","ryanvm@optonline.net","symbolic@live.com","mthurn@aol.com","whimsy@icloud.com","whimsy@verizon.net","uncle@gmail.com","hyper@outlook.com","rbarreira@icloud.com","dhwon@hotmail.com","dartlife@live.com","frode@att.net","grolschie@optonline.net","dkasak@verizon.net","mnemonic@verizon.net","zwood@optonline.net","keiji@att.net","roamer@gmail.com","grinder@aol.com","ryanshaw@comcast.net","bjoern@live.com","howler@verizon.net","engelen@att.net","weazelman@me.com","zilla@att.net","floxy@yahoo.com","shazow@mac.com","syncnine@hotmail.com","yumpy@live.com","phish@gmail.com","dowdy@comcast.net","penna@att.net","neuffer@optonline.net","esbeck@yahoo.ca","stakasa@yahoo.ca","unreal@live.com","kramulous@mac.com","seano@me.com","louise@sbcglobal.net","gtewari@comcast.net","andale@aol.com","shang@verizon.net","inico@icloud.com","mrobshaw@att.net","greear@mac.com","rmcfarla@hotmail.com","birddog@aol.com","jbryan@verizon.net","andrewik@outlook.com","jgwang@verizon.net","phish@icloud.com","dkeeler@yahoo.com","rfoley@att.net","carcus@yahoo.ca","martink@live.com","matsn@comcast.net","benanov@aol.com","osrin@aol.com","lauronen@outlook.com","gator@sbcglobal.net","parasite@msn.com","dsowsy@me.com","kobayasi@optonline.net","willg@verizon.net","quinn@comcast.net","hampton@yahoo.com","markjugg@hotmail.com","pdbaby@yahoo.ca","osrin@mac.com","bahwi@comcast.net","feamster@icloud.com","itstatus@outlook.com","tamas@optonline.net","gomor@outlook.com","jesse@icloud.com","fluffy@hotmail.com","kosact@aol.com","baveja@yahoo.com","nelson@verizon.net","animats@sbcglobal.net","formis@outlook.com"]
    let names =  ["Kasper","Jakob","Patrick","Martin", "peter", "Danni","skippy","ilikered","jfmulder","airship","stefano","shang","ducasse","ewaters","hampton","goresky","microfab","credmond","nicktrig","parksh","stakasa","zilla","lahvak","jsbach","kobayasi","sjmuir","dwsauder","payned","jsnover","oracle","snunez","dinther","sriha","jrkorson","flavell","lishoy","fluffy","esokullu","dbindel","hedwig","jsmith","rbarreira","scato","sokol","spadkins","william","jginspace","dwendlan","dmbkiwi","konst","itstatus","benanov","wagnerch","gommix","mjewell","cisugrad","ubergeeb","ismail","slaff","scottlee","tmccarth","fviegas","eabrown","retoh","nacho","eminence","lipeng","fangorn","purvis","marcs","andrewik","nighthawk","horrocks","elflord","leviathan","alfred","benits","starstuff","aracne","geekoid","ducasse","ideguy","sarahs","ivoibs","pgottsch","mchugh","khris","mnemonic","jfmulder","epeeist","jyoliver","eimear","donev","tbmaddux","miturria","peterhoeg","frederic","punkis","treit","camenisch","campbell","kildjean","geoffr","trygstad","miturria","sjmuir","danneng","ghaviv","vertigo","adhere","nighthawk","ryanvm","symbolic","mthurn","whimsy","whimsy","uncle","hyper","rbarreira","dhwon","dartlife","frode","grolschie","dkasak","mnemonic","zwood","keiji","roamer","grinder","ryanshaw","bjoern","howler","engelen","weazelman","zilla","floxy","shazow","syncnine","yumpy","phish","dowdy","penna","neuffer","esbeck","stakasa","unreal","kramulous","seano","louise","gtewari","andale","shang","inico","mrobshaw","greear","rmcfarla","birddog","jbryan","andrewik","jgwang","phish","dkeeler","rfoley","carcus","martink","matsn","benanov","osrin","lauronen","gator","parasite","dsowsy","kobayasi","willg","quinn","hampton","markjugg","pdbaby","osrin","bahwi","feamster","itstatus","tamas","gomor","jesse","fluffy","kosact","baveja","nelson","animats","formis","miturria","sbmrjbr","schumer","chaki","rjones","airship","retoh","marcs","jemarch","bryanw","neonatus","augusto","lstein","elmer","suresh"]

    for(let i = startfrom; i < newusers; i++){
        allUsers.push(
            {
                "fname"       :   names[i],
                "lname"       :   "test",
                "psw"         :   "12345678",
                "mail"        :   emails[i],
                "birthDate"   :   "2000-10-10", 
                "study"       :   study
            }
        );
        if(study == 5){
            study = 1;
        }
        else{
            study++;
        }
    }

    allUsers.forEach(user => {
        createUser(user);
    });
    console.log(newusers + " newusers createt")
}

