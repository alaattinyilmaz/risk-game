# RISKBudur

RISKBudur is a turn based strategy and board game engine that allows to play 2 to 6 people. This game has several customizable map options as Easy, Medium and Hard. Also, it allows people to chat in lobby page and game page. People can join in rooms in order to play in realtime. 

![Risk Game](https://alaatt.in/images/riskbudur1.jpeg)

![Login Page](https://alaatt.in/images/riskbudur2.jpeg)

![Lobby](https://alaatt.in/images/riskbudur3.jpeg)


# Technologies

We used several technologies in our system. 

Server: Express 

Database: MongoDB

Realtime: Socket.io

Map: Leaftlet - https://leafletjs.com

# How to run?

In order to run this software you need to install Node.JS firstly into your system.  

NodeJS Installation: https://www.youtube.com/watch?v=-u-j7uqU7sI

# Database

For database part you need to install MongoDB.

You can use this video for step-by-step MongoDB installation: https://www.youtube.com/watch?v=pWbMrx5rVBE

After installation you need to create a database named chatdb. Then, you need to insert tables into your database as follows:

MongoDB
Database Name: chatdb
Command: use chatdb

Database Tables: gameutils, players, territories, lobbychat, users

Commands: 
db.createCollection('gameutils');
db.createCollection('players'); 
db.createCollection('territories'); 
db.createCollection('lobbychat'); 
db.createCollection('users'); 
 
 
 # Server 
 
 After inserting collections or tables into your database you are ready to run our software. In order to run the server, open your terminal and go to directory of package.json and write the following command: 
node app.js

Finally, visit the http://localhost:3000/ page to access to software.
