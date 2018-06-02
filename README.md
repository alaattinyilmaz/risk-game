# risk-game

This is a javascript based implementation of risk strategy board game.
https://leafletjs.com

# How to run?

In order to run this software you need to install MongoDB firstly into your system. 

After installation you need to create a database named chatdb.

After all, you need to insert tables into your database as follows:

MongoDB
Database Name: chatdb
use chatdb

Database Tables:
db.createCollection('gameutils');
db.createCollection('players');
db.createCollection('territories');
db.createCollection('lobbychat');
db.createCollection('users');
