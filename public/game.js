// This turns a random number between 1 and 6 that represents a DICE
function rollDice(){
	return Math.floor(Math.random() * 5 + 1);
};

/////////////////////////////////////////////////////////////////
// Initial setup
var players = [];

function Player(id, name, infantry){
	this.id = id;
	this.name = name;
	this.infantry = infantry;
	this.restriction = false;
}

Player.prototype.

var currentPlayer = 0;

// The turn is belong to playerid nobody is allowed to play
function setTurn(playerid)
{
	currentPlayer = playerid;
	for (i = 0; i < playerCount; i++){
		players[i].restriction = true; // All players are restricted
	}
	players[playerid].restricted = false; // Only playerid is not restricted and can play
}

// Assumed 3 people: params: id, player name, number of soldiers
var PLAYER1 = new Player(1, "Alaattin", 35);
var PLAYER2 = new Player(2, "Misra", 35);
var PLAYER3 = new Player(3, "Orhun", 35);

players.push(PLAYER1,PLAYER2,PLAYER3);
let playerCount = players.length;
console.log(players);

// Initial dice roll to determine who is going to start
rollDice();

setTurn(PLAYER1); // Only PLAYER1 can play right now


function Territory (tid, tname, infantry, ownto){
	this.tid = tid;
	this.tname = tname;
	this.soldiers = soldiers;
	this.ownto = ownto;
}
