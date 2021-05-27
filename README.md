# Social Media and Relations WebApp P2-Project-AAU (Study Buddies)
This repository is a website developed as a P2 Project at Aalborg University. During the COVID-19 pandemic, students that started this year including ourselves had problems meeting the other students. We made a website where you can create an account, get matched with other people from your field of study and chat with them using a chat system we created.

Link to website: [sw2c2-19.p2datsw.cs.aau.dk](https://sw2c2-19.p2datsw.cs.aau.dk)

## Directory guide 
The directory ‘node’ contains the file ‘app.js’ which is the main JS file that is run by the server with node.js. All other files in ‘node’ are referenced within ‘app.js’. The directory  ‘DatabaseManagementJs’  contains scripts that are run with node.js to manage the database.  
In the directory ‘PublicResources’ are the following:  
* All public CSS, HTML and client-side JS.  
* ‘Bootstrap’ contains Bootstrap 4.0 from [getbootstrap.com](https://getbootstrap.com/)
* In js/eventsourceLib are the library used to make authenticated SSE from [github.com/Yaffle/EventSource](https://github.com/Yaffle/EventSource).  
* ‘pictures’ contains alle images used and faviconPackage for website. 

The directory ‘node_modules´ contains all modules and libraries used for the server-side. The project has a workspace: ‘workspace.code-workspace’. 

All the mentioned code except for the ones with a link to the source of the code, is developed and written by SW2 C2-19 at Aalborg University. 

## Technical content in repository
We use a Node.js Server and a MySQL database. the following are the key elements we use:
* Server-sent events with authentication  
* Login and HTML responds with HTTP authentication
* Server build HTML for chatsite
* MySQL database with foreign keys and joins
* Responsive website with Bootstrap
