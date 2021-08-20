# Meetings app
Meeting is an essential in every work of a company. This project is create in order to host a better meeting. Currently the application has 3 modes:
### Meeting Queue
There are some meetings that people talk all at once, when entering this mode, it is required people to speak in queue, whoever hit the raise button first will talk first, when that person done talking, they will hit the button done, give turn to the people who hit raise after
yutube### Question and Answer
This mode is created in order to raise question anonymously or with their name attached, make it easier for everyone to ask without worries
### Whiteboard
An interactive real-time whiteboard for better brainstorming within a team
### Back End
This project uses serverless framework. For more details, please visit serverless documentation https://serverless.com/

### Front End
Meetings uses React + Redux as for Javascript library.

## Running the tests
Install git on your computer, and clone this repo by type in your terminal 
```
git clone https://github.com/tnpha6/questions.git
```
Before tempting to run the env, you have to type in your file terminal
```
npm install
```
then with node_modules install, type in your file terminal
```
npm start
```
To create your room, click create room and then type in your name, hit proceed on the screen / enter on your keyboard, because you the one who created the room, you the admin of the room.
When you being redirected to the room, you can choose between Queue, Q&A or Whiteboard mode, this action will broadcast to all the members inside the room. 
To join the room, click on the JOIN button on the homepage, type in your ROOM ID and click join room or simply hit enter.
