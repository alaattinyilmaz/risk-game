 var countriesLayer;
  var current_player;
  var lastClick, lastClickedTerritory;

// Each territory has a territoryid, territory name, number of soldiers on it and who belongs to playerid (-1 means nobody)
function Territory (tid, tname, neighbors, infantry, ownsto){
  this.tid = tid;
  this.tname = tname;
  this.neighbors = neighbors;
  this.infantry = infantry;
  this.ownsto = ownsto;
}

// All territories with their neighbors
var TER0 = new Territory(0, 'Venezuela',  [ 4, 1, 2 ] , 0, 1);
var TER1 = new Territory(1, 'Brazil',  [ 3, 0, 2, 13 ] , 0, 1);
var TER2 = new Territory(2, 'PERU',  [ 3, 0, 1 ] , 0, 1);
var TER3 = new Territory(3, 'Argentina',  [ 0, 2 ] , 0, 1);
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
  var mapTerritories = [];
  var players = [];

  var currentPhase = 0;

  let REINFORCEMENT = 1;
  let ATTACK = 2;
  let FORTIFY = 3;

function Player(id, name, color, territories, infantry){
  this.id = id;
  this.name = name;
  this.color = color;
  this.infantry = infantry;
  this.territories = territories;
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

// INITIAL SETUP

// Assumed 3 people: params: id, player name, color,territories, number of soldiers
var PLAYER1 = new Player(0, "Alaattin", 'x', [], 20);
var PLAYER2 = new Player(1, "Misra", 'x', [], 20);
var PLAYER3 = new Player(2, "Orhun", 'x', [], 20);

let USER = PLAYER2; // Lets assume we are player2  

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

setTurn(USER.id); // Assume we started first!

  var firstTurn = true;
// At the first turn people will be asked to put up to 20 infantries on territories

  // This function will be called at the first initialization of layers
  function countriesOnEachFeature(feature, layer)
  {
    mapTerritories.push(layer); // Loading every map territory to an array to reach easly
    layer.on({mouseover : highlightFeature, mouseout : resetHighlight, click :whenClicked});
    // Initial soldier number on each territory
    //layer.bindTooltip(getInfantry(layer).toString(), {permanent:true,direction:'center',className: 'countryLabel'});  
  }

  // TODO: GetCurrentPlayer() from database can be added!!!

  // TODO: DATABASE CONNECTION NEEDED IN THIS FUNCTION
  var isGameFinished = (function() {
      return false;
    })();  

  currentPhase = REINFORCEMENT;
  
  // When user clicks a territory this function invokes
  function whenClicked(e)
  {
    if(currentPlayer == USER.id && !isGameFinished)
    {
      var glayer = e.target;  // Layer corresponds to Countries/Territories
      glayer.setStyle({ weight : 3, color: 'blue', fillColor:'yellow', fillOpacity: 0.8});
      var clickedTerritory = mapTerritories.indexOf(glayer); // Which territory did I clicked? It search it from map territory

      // TODO: Conditions must be added: REINFORCE, ATTACK, FORTIFY
      if(firstTurn && (firstTurnInfantries < 20))
      {       
      // Changing label ol this territory
       putInfantry(glayer); // Add infantry on this territory
       map.closeTooltip(glayer.getTooltip()); // Close old tooltip
       glayer.bindTooltip((getInfantry(glayer)).toString(), {permanent:true,direction:'center',className: 'countryLabel'}); 
      }
	  else if (!firstTurn){
	  
	  // At reinforcement phase user can only put infantries on his/her own territory
		if(currentPhase == REINFORCEMENT){
			setStatus(territories[clickedTerritory].ownsto);
			if(territories[clickedTerritory].ownsto == USER.id){
				putInfantry(glayer); // Add infantry on this territory
				map.closeTooltip(glayer.getTooltip()); // Close old tooltip
				glayer.bindTooltip((getInfantry(glayer)).toString(), {permanent:true,direction:'center',className: 'countryLabel'}); 
			}
		}
			
	  
	  
	  }

      if(lastClick && lastClick != glayer)
        { resetHeighlightofNeighBors(lastClickedTerritory); }

       //  highlightNeighbors(clickedTerritory);
         lastClick = glayer;
         lastClickedTerritory = clickedTerritory;
     }
     else if(!isGameFinished)
     {
        setStatus("It is not your turn."); // TODO: Add whose turn is now
     }

  }


  function reinforcePhase(){
    if(currentPlayer == USER.id)
    { 
      reinforceBtn.style.backgroundColor = '#09821B';
      nextPhaseBtn.disabled = false;
    }
  }

  function attackPhase(){
    if(currentPlayer == USER.id)
    { 
      reinforceBtn.disabled = true; 
      attackBtn.style.backgroundColor = '#9E0E15';
    }
  }

  function fortifyPhase(){
    if(currentPlayer == USER.id)
    { 
      attackBtn.disabled = true;
      fortifyBtn.style.backgroundColor = '#FF5900';
      nextPhaseBtn.firstChild.data = "END TURN"; 
      nextPhaseBtn.style.backgroundColor = "red";
    }
  }

  function resetAttributes(){
      reinforceBtn.style.backgroundColor = '#1642A8';
      attackBtn.style.backgroundColor = '#1642A8';
      fortifyBtn.style.backgroundColor = '#1642A8';
      nextPhaseBtn.style.backgroundColor = '#1642A8';
      reinforceBtn.disabled = false;
      attackBtn.disabled = true;
      fortifyBtn.disabled = true;
      nextPhaseBtn.disabled = true;
      nextPhaseBtn.firstChild.data = "NEXT PHASE"; 
  }

  function nextPhase(){
      if(currentPhase == REINFORCEMENT)
      { 
        currentPhase = ATTACK; 
        reinforceBtn.disabled = true;
        attackBtn.disabled = false;
        attackPhase();
      }
      else if(currentPhase == ATTACK)
      { 
        currentPhase = FORTIFY;
        fortifyBtn.disabled = false; 
        fortifyPhase(); 
      }      
      else if(currentPhase == FORTIFY)
      { 
		firstTurn = false;
        endTurn();
      }
  }


// TODO: Did he really played or not? check please
  function endTurn(){
    if(currentPlayer == USER.id)
    { 
        resetAttributes();
        currentPhase = REINFORCEMENT;
        //nextTurn();
    }

  }

  // Gets infantry number of the territory
  function getInfantry(layer)
  {
     return layer.feature.properties.ARMYCOUNT;
  }

  // Highlight feature function
  function highlightFeature(e)
  {
    var layer = e.target;
    layer.setStyle({ weight : 3, color : 'black', fillColor : 'white', fillOpacity : 0.2,});
    if(!L.Browser.ie && !L.Browser.opera)
    { layer.bringToFront(); }
  }

  // Highlighting of a territory
  function highlightTerritory(target)
  {
    var layer = target;
    layer.setStyle({ weight : 3, color : 'black', fillColor : 'white', fillOpacity : 0.2, });
    if(!L.Browser.ie && !L.Browser.opera)
    { layer.bringToFront(); }
  }

  // Reset highlighting of a territory
  function resetHighlightTerritory(target)
  {
    countriesLayer.resetStyle(target);
  }

  // reset hightlight function
  function resetHighlight(e)
  {
    countriesLayer.resetStyle(e.target);
  }

  // zoom to feature
  function zoomToFeature(e)
  {
    // map.fitBounds(e.target.getBounds());
  }

  // Highlighting of a neighbors of a territory with a territoryid
  function highlightNeighbors(tid)
  {
      for(var j = 0; j < territories[tid].neighbors.length; j++){
        highlightTerritory(mapTerritories[territories[tid].neighbors[j]]);
      } 
  }

  // Resetting of heighlight of the neighbor of a territory by its territory id
  function resetHeighlightofNeighBors(tid)
  {
      for(var j = 0; j < territories[tid].neighbors.length; j++){
        resetHighlightTerritory(mapTerritories[territories[tid].neighbors[j]]);
      } 
  }


// EKLEDIM
var counter_asia = 0; // FIRST TURN AND THE OTHERS COUNTERS ADDED
var counter_south_america = 0;
var counter_north_america = 0;
var counter_africa = 0;
var counter_europe = 0;
var counter_ocenia = 0;
var firstTurnInfantries = 0;

  function putInfantry(layer)
  { // EKLEDIM
    var continent = layer.feature.properties.CONTINENT;

    if(firstTurn == true)
    {
        if(firstTurnInfantries < 20) // en basta 20  asker koyduğunu düşünürsek
        {
        layer.feature.properties.ARMYCOUNT = layer.feature.properties.ARMYCOUNT + 1;
        firstTurnInfantries = firstTurnInfantries + 1;
        }
    }
    else
    {
      if(continent == "Asia")
      {
        if(counter_asia < 7)
        {
          layer.feature.properties.ARMYCOUNT = layer.feature.properties.ARMYCOUNT + 1;
          counter_asia = counter_asia + 1;
        }
      }
      else if(continent == "Europe")
      {
        if(counter_europe < 5)
        {
          layer.feature.properties.ARMYCOUNT = layer.feature.properties.ARMYCOUNT + 1;
          counter_europe = counter_europe + 1;
        }
      }
      else if(continent == "Africa")
      {
        if(counter_africa < 3)
        {
          layer.feature.properties.ARMYCOUNT = layer.feature.properties.ARMYCOUNT + 1;
          counter_africa = counter_africa + 1;
        }
      }
      else if(continent == "Oceania")
      {
        if(counter_ocenia < 2)
        {
          layer.feature.properties.ARMYCOUNT = layer.feature.properties.ARMYCOUNT + 1;
          counter_ocenia = counter_ocenia + 1;
        }
      }
      else if(continent == "North America")
      {
        if(counter_north_america < 5)
        {
          layer.feature.properties.ARMYCOUNT = layer.feature.properties.ARMYCOUNT + 1;
          counter_north_america = counter_north_america + 1;
        }
      }
      else if(continent == "South America")
      {
        if(counter_south_america < 2)
        {
          layer.feature.properties.ARMYCOUNT = layer.feature.properties.ARMYCOUNT + 1;
          counter_south_america = counter_south_america + 1;
        }
      }
    }

  }

  // Country color function
  function getCountryColor(CONTINENT)
  {
    if(CONTINENT == "Asia")
    { return 'orange';  }
    else if(CONTINENT == "Europe")
    { return 'blue'; }
    else if(CONTINENT == "Oceania")
    { return 'green'; }
    else if(CONTINENT == "North America")
    { return 'brown'; }
    else if(CONTINENT == "South America")
    { return 'yellow'; }
    else if(CONTINENT == "Africa")
    { return 'red'; }
  }

// Style of features
  function countriesStyle(feature)
  {
    return {fillColor : getCountryColor(feature.properties.CONTINENT),
      weight : 2,
      opacity : 1,
      color : 'black',
      dashArray : 3,
      fillOpacity : 0.8
    }
  }

// Map center and zoom scale
  var map = L.map('map').setView([43.8476, 18.3564], 2);
  countriesLayer = L.geoJson( countries, { style : countriesStyle, onEachFeature : countriesOnEachFeature}).addTo(map);


// It is used for legends - > We can use it to add control panel or sth else
  var legend = L.control({position : 'topright'}); // lejant eklemek için

  legend.onAdd = function(map)
  {
    var div = L.DomUtil.create('div','legend');
    div.innerHTML = '<div class="container"><h4><div id="gamestatus">Press end turn to finish the turn.</div></h4></div>';
    return div;
  }

  var legend2 = L.control({position : 'bottomright'}); // lejant eklemek için

  legend2.onAdd = function(map)
  {
    var div = L.DomUtil.create('div','legend');
    div.innerHTML = '<div class="container"><button id="reinforcebutton" type="button" class="btn btn-reinforce btn-lg" onClick="reinforcePhase()">Reinforce</button> <button id="attackbutton" type="button" class="btn btn-attack btn-lg" disabled>Attack</button> <button id="fortifybutton" type="button" class="btn btn-fortify btn-lg" disabled>Fortify</button> <button id="nextphasebutton" type="button" class="btn btn-fortify btn-lg" onClick ="nextPhase()" disabled>NEXT PHASE</button></div>';
    return div;
  }


  legend.addTo(map);
  legend2.addTo(map);

// HTML PART
        var element = function(id)
        {
          return document.getElementById(id);
        }

        // Get element
        var gameStatus = element('gamestatus');   
        var messages = element('messages');
        var textarea = element('textarea');
        var username = element('username');
        var clearBtn = element('clear');    
        var nextPhaseBtn = element('nextphasebutton');
        var reinforceBtn = element('reinforcebutton');
        var attackBtn = element('attackbutton');
        var fortifyBtn = element('fortifybutton');

        reinforceBtn = element('reinforcebutton');
        //reinforceBtn.addEventListener('onClick', reinforcePhase());
        //nextPhaseBtn.addEventListener('onClick', nextPhase());

        // Set default status
        var statusDefault = gameStatus.textContent;

        // Set the status
        var setStatus = function(s){
          gameStatus.textContent = s;
        }
