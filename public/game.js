
// INITIAL SETUP

var players = [];

function Player(id, name, color, infantry){
	this.id = id;
	this.name = name;
	this.color = color;
	this.infantry = infantry;
	this.restriction = false;
}

// Initally nobody is playing (-1)
var currentPlayer = -1; 

// This turns a random number between 1 and 6 that represents a DICE
function rollDice(){
	return Math.floor(Math.random() * 5 + 1);
};

// The turn is belong to playerid nobody else is allowed to play
function setTurn(playerid)
{

	// TODO: Database connection setting they all need to be set on the database 
	currentPlayer = playerid;
	for (i = 0; i < playerCount; i++){
		players[i].restriction = true; // All players are restricted (will be checked by database: am i restricted?)
	}
	players[playerid].restriction = false; // Only playerid is not restricted and can play
}

// Decides who is going to play next // TODO: DATABASE CONNECTION AND CHECKING
function nextTurn(){
	if(currentPlayer==playerCount)
		nextPlayer = 0;
	else
		nextPlayer = currentPlayer+1;
	setTurn(nextPlayer);
}

// Assumed 3 people: params: id, player name, color, number of soldiers
var PLAYER1 = new Player(0, "Alaattin", 'x', 15);
var PLAYER2 = new Player(1, "Misra", 'x', 15);
var PLAYER3 = new Player(2, "Orhun", 'x', 15);

// Adding all the players
players.push(PLAYER1, PLAYER2, PLAYER3);
let playerCount = players.length;


// Returns a random number 0-to Player Count
function getRandomPlayer(){
	return Math.floor(Math.random() * playerCount);
};

// Please choose a color HTML/ or wont allow to choose only assignment NEED TO BE HANDLED!!
// Click handling // Invisible of THESE COLORS sections
let color = ['r','b','y'];

for (i = 0; i < playerCount; i++)
{
	players[i].color = color[i];
}

// Each territory has a territoryid, territory name, number of soldiers on it and who belongs to playerid (-1 means nobody)
function Territory (tid, tname, neighbors, infantry, ownto){
  this.tid = tid;
  this.tname = tname;
  this.neighbors = neighbors;
  this.infantry = infantry;
  this.ownto = ownto;
}


/* COUNTRY PARSING FROM GEOJSON 
for (i = 0; i < countries.features.length; i++){
  var TER = new Territory(i, countries.features[i].properties.NAME, countries.features[i].properties.NEIGHBORS, 0, -1);
    console.log('var TER'+i+' = new Territory('+i+', \''+countries.features[i].properties.NAME+'\', ');
	console.log(countries.features[i].properties.NEIGHBORS);
  	console.log(', 0, -1);');
}
*/

// All territories with neighbors
/*
var TER0 = new Territory(0, 'Venezuela', [ 'Mexico', 'Brazil', 'PERU' ], 0, -1);
var TER1 = new Territory(1, 'Brazil', [ 'Argentina', 'Venezuela', 'PERU', 'North Africa' ], 0, -1);
var TER2 = new Territory(2, 'PERU',[ 'Argentina', 'Venezuela', 'Brazil' ], 0, -1);
var TER3 = new Territory(3, 'Argentina', [ 'Venezuela', 'PERU' ], 0, -1);
var TER4 = new Territory(4, 'Mexico',[ 'Eastern United States', 'Venezuela', 'Western United States' ], 0, -1);
var TER5 = new Territory(5, 'Western United States', [ 'Eastern United States', 'Mexico', 'Alberta', 'Ontario' ], 0, -1);
var TER6 = new Territory(6, 'Eastern United States', [ 'Ontario', 'Eastern Canada', 'Western United States' ], 0, -1);
var TER7 = new Territory(7, 'Eastern Canada',[ 'Eastern United States', 'Ontario', 'Greenland' ], 0, -1);
var TER8 = new Territory(8, 'Alaska',[ 'North West Territory', 'Alberta', 'Khamchatka' ], 0, -1);
var TER9 = new Territory(9, 'North West Territory',[ 'Alaska', 'Alberta', 'Ontario', 'Greenland' ], 0, -1);
var TER10 = new Territory(10, 'Ontario',[ 'Eastern United States',  'Alberta',  'Western United States',  'Eastern Canada', 'North West Territory', 'Greenland' ], 0, -1);
var TER11 = new Territory(11, 'Alberta',[ 'Ontario',  'Alaska',  'North West Territory', 'Western United States' ], 0, -1);
var TER12 = new Territory(12, 'Egypt', [ 'Southern Europe', 'Middle East', 'North Africa', 'East Africa' ], 0, -1);
var TER13 = new Territory(13, 'North Africa',[ 'Western Europe', 'Brazil', 'Egypt', 'East Africa', 'Congo' ], 0, -1);
var TER14 = new Territory(14, 'East Africa',[ 'Egypt', 'Middle East', 'Madagascar', 'Congo', 'North Africa' ], 0, -1);
var TER15 = new Territory(15, 'Congo',[ 'North Africa', 'South Africa', 'East Africa' ], 0, -1);
var TER16 = new Territory(16, 'South Africa',[ 'Congo', 'Madagascar', 'East Africa' ], 0, -1);
var TER17 = new Territory(17, 'Middle East',[ 'Egypt',  'East Africa',  'India',  'Afghanistan', 'Ukraine', 'Southern Europe' ], 0, -1);
var TER18 = new Territory(18, 'Western Europe', [ 'North Africa', 'Southern Europe', 'Northern Europe' ], 0, -1);
var TER19 = new Territory(19, 'Southern Europe', [ 'Egypt', 'Middle East', 'Northern Europe', 'Southern Europe', 'Ukraine' ] , 0, -1);
var TER20 = new Territory(20, 'Ukraine', [ 'Ural', 'Afghanistan', 'Middle East', 'Scandinavia', 'Northern Europe', 'Southern Europe' ] , 0, -1);
var TER21 = new Territory(21, 'Scandinavia', [ 'Ukraine', 'Northern Europe', 'Iceland', 'Great Britain' ] , 0, -1);
var TER22 = new Territory(22, 'Northern Europe', [ 'Great Britain', 'Scandinavia', 'Southern Europe', 'Western Europe', 'Ukraine' ], 0, -1);
var TER23 = new Territory(23, 'Great Britain', [ 'Iceland', 'Scandinavia', 'Northern Europe' ] , 0, -1);
var TER24 = new Territory(24, 'Iceland', [ 'Greenland', 'Great Britain', 'Scandinavia' ] , 0, -1);
var TER25 = new Territory(25, 'India', [ 'Middle East', 'Afghanistan', 'China', 'Siam' ], 0, -1);
var TER26 = new Territory(26, 'Afghanistan', [ 'Middle East', 'Ukraine', 'Ural', 'India', 'China' ], 0, -1);
var TER27 = new Territory(27, 'Madagascar', [ 'South Africa', 'East Africa' ] , 0, -1);
var TER28 = new Territory(28, 'Siam', [ 'Indonesia', 'India', 'China' ] , 0, -1);
var TER29 = new Territory(29, 'China', [ 'Afghanistan', 'Siam', 'India', 'Siberia', 'Ural', 'Mongolia' ] , 0, -1);
var TER30 = new Territory(30, 'Mongolia', [ 'China', 'Siberia', 'Irutsk', 'Kamchatka', 'Japan' ] , 0, -1);
var TER31 = new Territory(31, 'Ural', [ 'Ukraine', 'Siberia', 'Afghanistan', 'China' ] , 0, -1);
var TER32 = new Territory(32, 'Kamchatka', [ 'Alaska', 'Japan', 'Irutsk', 'Yakutsk', 'Mongolia' ] , 0, -1);
var TER33 = new Territory(33, 'Yakutsk', [ 'Irutsk', 'Kamchatka', 'Siberia' ] , 0, -1);
var TER34 = new Territory(34, 'Siberia', [ 'Ural', 'Yakutsk', 'Irutsk', 'Mongolia', 'China' ] , 0, -1);
var TER35 = new Territory(35, 'Irutsk', [ 'Mongolia', 'Yakutsk', 'Siberia', 'Kamchatka' ] , 0, -1);
var TER36 = new Territory(36, 'Japan', [ 'Khamchatka', 'Mongolia' ] , 0, -1);
var TER37 = new Territory(37, 'Indonesia', [ 'Siam', 'New Guinea', 'Australia' ] , 0, -1);
var TER38 = new Territory(38, 'New Guinea',[ 'Indonesia', 'Australia' ], 0, -1);
var TER39 = new Territory(39, 'Australia', [ 'Indonesia', 'New Guinea' ], 0, -1);
var TER40 = new Territory(40, 'Greenland', [ 'North West Territory', 'Ontario', 'Eastern Canada', 'Iceland' ], 0, -1);
*/

// All territories with their neighbors
var TER0 = new Territory(0, 'Venezuela',  [ 4, 1, 2 ] , 0, -1);
var TER1 = new Territory(1, 'Brazil',  [ 3, 0, 2, 13 ] , 0, -1);
var TER2 = new Territory(2, 'PERU',  [ 3, 0, 1 ] , 0, -1);
var TER3 = new Territory(3, 'Argentina',  [ 0, 2 ] , 0, -1);
var TER4 = new Territory(4, 'Mexico',  [ 6, 0, 5 ] , 0, -1);
var TER5 = new Territory(5, 'Western United States',  [ 6, 4, 11, 10 ] , 0, -1);
var TER6 = new Territory(6, 'Eastern United States',  [ 10, 7, 5 ] , 0, -1);
var TER7 = new Territory(7, 'Eastern Canada',  [ 6, 10, 40 ] , 0, -1);
var TER8 = new Territory(8, 'Alaska',  [ 9, 11, 0 ] , 0, -1);
var TER9 = new Territory(9, 'North West Territory',  [ 8, 11, 10, 40 ] , 0, -1);
var TER10 = new Territory(10, 'Ontario',  [ 6, 11, 5, 7, 9, 40 ] , 0, -1);
var TER11 = new Territory(11, 'Alberta',  [ 10, 8, 9, 5 ] , 0, -1);
var TER12 = new Territory(12, 'Egypt',  [ 19, 17, 13, 14 ] , 0, -1);
var TER13 = new Territory(13, 'North Africa',  [ 18, 1, 12, 14, 15 ] , 0, -1);
var TER14 = new Territory(14, 'East Africa',  [ 12, 17, 27, 15, 13 ] , 0, -1);
var TER15 = new Territory(15, 'Congo',  [ 13, 16, 14 ] , 0, -1);
var TER16 = new Territory(16, 'South Africa',  [ 15, 27, 14 ] , 0, -1);
var TER17 = new Territory(17, 'Middle East',  [ 12, 14, 25, 26, 20, 19 ] , 0, -1);
var TER18 = new Territory(18, 'Western Europe',  [ 13, 19, 22 ] , 0, -1);
var TER19 = new Territory(19, 'Southern Europe',  [ 12, 17, 22, 19, 20 ] , 0, -1);
var TER20 = new Territory(20, 'Ukraine',  [ 31, 26, 17, 21, 22, 19 ] , 0, -1);
var TER21 = new Territory(21, 'Scandinavia',  [ 20, 22, 24, 23 ] , 0, -1);
var TER22 = new Territory(22, 'Northern Europe',  [ 23, 21, 19, 18, 20 ] , 0, -1);
var TER23 = new Territory(23, 'Great Britain',  [ 24, 21, 22 ] , 0, -1);
var TER24 = new Territory(24, 'Iceland',  [ 40, 23, 21 ] , 0, -1);
var TER25 = new Territory(25, 'India',  [ 17, 26, 29, 28 ] , 0, -1);
var TER26 = new Territory(26, 'Afghanistan',  [ 17, 20, 31, 25, 29 ] , 0, -1);
var TER27 = new Territory(27, 'Madagascar',  [ 16, 14 ] , 0, -1);
var TER28 = new Territory(28, 'Siam',  [ 37, 25, 29 ] , 0, -1);
var TER29 = new Territory(29, 'China',  [ 26, 28, 25, 34, 31, 30 ] , 0, -1);
var TER30 = new Territory(30, 'Mongolia',  [ 29, 34, 35, 32, 36 ] , 0, -1);
var TER31 = new Territory(31, 'Ural',  [ 20, 34, 26, 29 ] , 0, -1);
var TER32 = new Territory(32, 'Kamchatka',  [ 8, 36, 35, 33, 30 ] , 0, -1);
var TER33 = new Territory(33, 'Yakutsk',  [ 35, 32, 34 ] , 0, -1);
var TER34 = new Territory(34, 'Siberia',  [ 31, 33, 35, 30, 29 ] , 0, -1);
var TER35 = new Territory(35, 'Irutsk',  [ 30, 33, 34, 32 ] , 0, -1);
var TER36 = new Territory(36, 'Japan',  [ 0, 30 ] , 0, -1);
var TER37 = new Territory(37, 'Indonesia',  [ 28, 38, 39 ] , 0, -1);
var TER38 = new Territory(38, 'New Guinea',  [ 37, 39 ] , 0, -1);
var TER39 = new Territory(39, 'Australia',  [ 37, 38 ] , 0, -1);
var TER40 = new Territory(40, 'Greenland',  [ 9, 10, 7, 24 ] , 0, -1);

var territories = [TER0,TER1,TER2,TER3,TER4,TER5,TER6,
				   TER7,TER8,TER9,TER10,TER11,TER12,TER13,
				   TER14,TER15,TER16,TER17,TER18,TER19,TER20,
				   TER21,TER22,TER23,TER24,TER25,TER26,TER27,
				   TER28,TER29,TER30,TER31,TER32,TER33,TER34,
				   TER35,TER36,TER37,TER38,TER39,TER40];

let territoryCount = territories.length;

/*
function findNum(name){

	for(i = 0; i < territories.length; i++){
		if(name == territories[i].tname)
		{
			return i;
		}
	}
	return 0;
}


//console.log(findNum('Japan'));
function Territory2 (tid, tname, neighbors, infantry, ownto){
  this.tid = tid;
  this.tname = tname;
  this.neighbors = neighbors;
  this.infantry = infantry;
  this.ownto = ownto;
}

function myne (tid, neigh){
  this.tid = tid;
  this.neigh = neigh;
}

var neigs = [];

for (k = 0; k < territories.length; k++){
	var neig = new myne(k, []);
	neigs.push(neig);
	//console.log("callingfor",territories[k].tname);
	for (j = 0; j < territories[k].neighbors.length; j++){
		var num = findNum(territories[k].neighbors[j]);
		neigs[k].neigh.push(num);
	}
}

for (z = 0; z < territories.length; z++){
    console.log('var TER'+z+' = new Territory('+z+', \''+ territories[z].tname+'\', ', neigs[z].neigh, ', 0, -1);');
}
*/




// Putting infantry on this territory
Territory.prototype.putInfantry = function(){
	// TODO: Database connection will be done!
	// TODO: If really current player clicked or not???? CHECK FROM SERVER
	// TODO: Infantry number of the player will be dropped by database side!
	if(players[currentPlayer].infantry > 0) {	
		players[currentPlayer].infantry--; 	
		this.infantry++;
	}
}

// Occupying each territory randomly
for (i = 0; i < territoryCount; i++){
	currentPlayer = getRandomPlayer();
}

//console.log(territories);

/*
// Initial dice roll to determine who is going to start // TODO: MAYBE CHECK DRAWS!!
var dices = [];
for (i = 0; i < playerCount; i++){
	dices.push(rollDice());
}

// Person who rolls the highest dice
var highestPlayer = dices.indexOf(Math.max.apply(Math, dices));
highestPlayer = PLAYER1.id; // Just to be sure about the rest of the code, I reduced randomness

setTurn(highestPlayer); // Only highestPlayer=currentPlayer can play right now
*/
