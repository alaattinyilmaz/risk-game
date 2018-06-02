        var countriesLayer;
        var current_player;
        var lastClick, lastClickedTerritory;
        var fortifyTerritoryFromLayer, fortifyTerritoryToLayer, fortifyTerritoryFrom, fortifyTerritoryTo, fortifyTerritoryToSave;
        var attackTerritoryFromLayer, attackTerritoryToLayer, attackTerritoryFrom, attackTerritoryTo, attackTerritoryToSave;
        var fortifyFrom = null;
        var attackFrom = null;
        var gameid = gameid;
        var leftInfantry = -1;
        var territories;
        var mapTerritories = [];
        var players = [];
        var isCancelled = false;
        var isGameFinished = false;
        var currentPhase = 0;
        let REINFORCEMENT = 1;
        let ATTACK = 2;
        let FORTIFY = 3;


        var socket = io('/'+gameid);

        if(socket != undefined)
        {
          console.log("Socket connected to server.");
        }

      function Player(gameid, pid, name, infantry, territories){
        this.gameid = gameid;
        this.pid = pid;
        this.name = name;
        this.infantry = infantry;
        this.territories = territories;
      }


        // Initally nobody is playing (-1)
        var currentPlayer = -1;

        // The turn is belong to playerid nobody else is allowed to play
        function setTurn(playerid)
        {
          currentPlayer = playerid;

          if (!firstTurn)
          {
            console.log(currentPlayer);
            console.log(players[currentPlayer]);
            setStatus("Turn is now at "+ players[currentPlayer].name);
            console.log(players);
            reinforcePhaseStyle();
          }
          //resetAttributes();
        }

            // Dummy players
            var PLAYER1 = new Player(gameid,0, creater, 20, []);
            var PLAYER2 = new Player(gameid,1, "x", 20, []);
            var PLAYER3 = new Player(gameid,2, "x", 20, []);
            var PLAYER4 = new Player(gameid,3, "x", 20, []);
            var PLAYER5 = new Player(gameid,4, "x", 20, []);
            var PLAYER6 = new Player(gameid,5, "x", 20, []);

            var DUMMYPLAYER = new Player(gameid,6, "x", 20, []);

        let howManyPeople = howmany;
        // INITIAL SETUP HOW MANY PEOPLE
        if(howManyPeople==2){
          players= [ PLAYER1,PLAYER2 ];
        }
        else if(howManyPeople==3)
        {
          players = [ PLAYER1,PLAYER2,PLAYER3 ];
        }
        else if(howManyPeople==4)
        {
          players = [ PLAYER1,PLAYER2,PLAYER3,PLAYER4 ];
        }
        else if(howManyPeople==5)
        {
          players = [ PLAYER1,PLAYER2,PLAYER3,PLAYER4,PLAYER5 ];
        }
        else if(howManyPeople==6)
        {
          players = [PLAYER1,PLAYER2,PLAYER3,PLAYER4,PLAYER5,PLAYER6];
        }


      //  var USER = PLAYER2; // Lets assume we are player2

      // TODO: !!!!!!!! at /creategame there is not a user id defined
        if(username == creater){
        var USER = players[0];
        }
      else
        {
        var USER = DUMMYPLAYER;
        }

        let playerCount = players.length;


        function highlightFeatureNULL(){}

        // At the first turn people will be asked to put up to 20 infantries on territories
      
        // This function will be called at the first initialization of layers
        function countriesOnEachFeature(feature, layer)
        {

          mapTerritories.push(layer); // Loading every map territory to an array to reach easily
          layer.on({mouseover : highlightFeatureNULL, mouseout : highlightFeatureNULL, click :whenClicked});
          // Initial soldier number on each territory
          //layer.bindTooltip(getInfantry(layer).toString(), {permanent:true,direction:'center',className: 'countryLabel'});
        }

        // TODO: GetCurrentPlayer() from database can be added!!!
        var firstTurn = true;
        currentPhase = -1; // Assume the current phase is firstturn
     // firstTurn = false;

        var initialization = true;

        // When user clicks a territory this function invokes
        function whenClicked(e)
        {

          if(currentPlayer == USER.pid && !isGameFinished)
          {

             if (!firstTurn){
            var clickedTerritoryLayer = e.target;  // Layer corresponds to Countries/Territories
            var clickedTerritory = mapTerritories.indexOf(clickedTerritoryLayer); // Which territory did I clicked? It search it from map territory
         
          // At reinforcement phase user can only put infantries on his/her own territory
            if(currentPhase == REINFORCEMENT){
              if(territories[clickedTerritory].ownsto == USER.pid){ // this check will be done in server
              putInfantry(clickedTerritory);
                if(leftInfantry == 0){
                  setStatus("You do not have any infantry.");
                }
                else {
                  setStatus("You reinforced a territory.");
                }
              }
              else {
                setStatus("You can not reinforce a territory which you do not have.");
              }
            }

            else if (currentPhase == ATTACK)
          {
              //fortifyPhaseStyle();

              if (attackFrom == null)
              {
                  isCancelled = false;
                  attackFrom = clickedTerritoryLayer;
                  attackTerritoryFromLayer = clickedTerritoryLayer;
                  attackTerritoryFrom = clickedTerritory;

                  if(territories[attackTerritoryFrom].infantry >= 2 && territories[attackTerritoryFrom].ownsto == USER.pid) // checks if the clicked territory has at least 2 infantry and owned by current player
                   {
                      nextPhaseBtn.disabled = true;
                      clickedTerritoryLayer.setStyle({ weight : 3, color: 'blue', fillColor:'red', fillOpacity: 1});

                      if(highlightAttackables (attackTerritoryFrom) == 0)
                      {
                        setStatus("There is no neighbor to attack from that territory");
                        resetHighlightTerritory(attackTerritoryFromLayer);
                        nextPhaseBtn.disabled = false;
                        attackFrom = null;
                     }
                     else
                     {
                      nextPhaseBtn.disabled = true;
                      setStatus("You are attacking from "+ attackTerritoryFromLayer.feature.properties.NAME +", please select a territory to ATTACK TO");
                     }

                   }
                   else // choose again
                   {
                    attackFrom = null;
                    setStatus("You need to choose another country!");
                   }

              }
              else if (attackTerritoryTo != null && isCancelled){ // NOTE player can attack multiple times
                   isCancelled = false;
                   setStatus("You can not attack more than one territory!");
              }

              else
              {

                    attackTerritoryToLayer = clickedTerritoryLayer;
                    attackTerritoryTo = clickedTerritory;

                    if(canAttack(attackTerritoryFrom,attackTerritoryTo) && attackTerritoryToSave == null )
                    {
                      attackTerritoryToSave = attackTerritoryTo; // NOTE to prevent bugs for clicking his/her country again, also this will send to game.js
                    clickedTerritoryLayer.setStyle({ weight : 3, color: 'blue', fillColor:'red', fillOpacity: 1});
                    nextPhaseBtn.disabled = true;
                   //  var attackHTML = '<button id="attackbutton" type="button" class="btn btn-attack" >Attack</button> ';
                   clickedTerritoryLayer.bindPopup('<center><b>Are you sure to attack?</b> <br><br><button id="attackbutton" type="button" class="btn btn-attack" onClick="confirmAttack()">Attack</button><button id="attackbutton" type="button" class="btn btn-attack" onClick="cancelAttack()">Cancel</button><br><br>');
                   clickedTerritoryLayer.openPopup();// pop up a confirmation message
                  //  clickedTerritoryLayer.unbindPopup();
                    setStatus("Please click to NEXTPHASE to finish your attack to " + clickedTerritoryLayer.feature.properties.NAME);
                  }

                  else
                  {
                      if(attackTerritoryToSave != null) // if already choosed a valid country to attack
                      {
                          attackTerritoryTo=attackTerritoryToSave;
                          nextPhaseBtn.disabled = true;
                          setStatus("You need to cancel first! ");
                      }
                      else // if the country is not valid
                      {
                        attackTerritoryTo=null;
                        setStatus("Please choose another country! ");
                      }
                  }
              }
          }














            else if (currentPhase == FORTIFY){
              //fortifyPhaseStyle();
              if (fortifyFrom == null){

                  isCancelled = false;
                  fortifyFrom = clickedTerritoryLayer;
                  fortifyTerritoryFromLayer = clickedTerritoryLayer;
                  fortifyTerritoryFrom = clickedTerritory;
                  setStatus("Please select a territory to fortify");

                   // checks if the clicked territory has at least 2 infantry and owned by current player
                   if(territories[fortifyTerritoryFrom].infantry >= 2 && territories[fortifyTerritoryFrom].ownsto == USER.pid){

                      clickedTerritoryLayer.setStyle({ weight : 3, color: 'blue', fillColor:'green', fillOpacity: 0.5});

                     if(highlightFortifyables (fortifyTerritoryFrom) == 0){
                      setStatus("There is no neighbor to fortify from that territory");
                      resetHighlightTerritory(fortifyTerritoryFromLayer);
                      nextPhaseBtn.disabled = false;
                      fortifyFrom = null;
                      //
                     }
                     else {
                      nextPhaseBtn.disabled = true;
                      setStatus("You are fortifying from "+ fortifyTerritoryFromLayer.feature.properties.NAME +", please select a territory to FORTIFY TO");
                      }


                   }
                   else // choose again
                   {
                    fortifyFrom =null;
                    setStatus("You need to choose another country!");
                   }

              }

              else if (fortifyTerritoryTo != null && isCancelled){ // NOTE player can attack multiple times
                   isCancelled = false;
                   setStatus("You can not attack more than one territory!");
              }

              else {

                  fortifyTerritoryToLayer = clickedTerritoryLayer;
                  fortifyTerritoryTo = clickedTerritory;

                  if(canFortify(fortifyTerritoryFrom, fortifyTerritoryTo) && fortifyTerritoryToSave == null )
                  {
                  fortifyTerritoryToSave = fortifyTerritoryTo; // NOTE to prevent bugs for clicking his/her country again, also this will send to game.js
                  clickedTerritoryLayer.setStyle({ weight : 3, color: 'blue', fillColor:'yellow', fillOpacity: 0.7});
                  nextPhaseBtn.disabled = true;

                   //  var attackHTML = '<button id="attackbutton" type="button" class="btn btn-attack" >Attack</button> ';

                  var fortifyInfantryHTML = '';
                  for(var j = 1; j < territories[fortifyTerritoryFrom].infantry; j++)
                  {
                    fortifyInfantryHTML += '<option value="'+j+'">'+j+'</option>';
                  }

                  clickedTerritoryLayer.bindPopup('<center><b>How many infantry do you want to fortify?</b> <br><select id="fortifyamount">'+fortifyInfantryHTML+'</select><br><button id="fortifybutton" type="button" class="btn btn-fortify" onClick="confirmFortify()">Fortify</button><button id="fortifybutton" type="button" class="btn btn-fortify" onClick="cancelFortify()">Cancel</button><br><br>');
                  clickedTerritoryLayer.openPopup();// pop up a confirmation message
                  //  clickedTerritoryLayer.unbindPopup();
                    setStatus("Please click to NEXTPHASE to finish your attack to " + clickedTerritoryLayer.feature.properties.NAME);

                  }

                  else
                  {
                      if(fortifyTerritoryToSave != null) // if already choosed a valid country to fortify
                      {
                          fortifyTerritoryTo = fortifyTerritoryToSave;
                          nextPhaseBtn.disabled = true;
                          setStatus("You need to cancel or complete your fortify first! ");
                          //fortifyTerritoryTo.openPopup();
                      }
                      else // if the country is not valid
                      {
                        fortifyTerritoryTo = null;
                        setStatus("Please choose another country! ");
                      }
                  }

              }
            }

          }

          /*
          if(lastClick && lastClick != glayer)
          { resetHeighlightofNeighBors(lastClickedTerritory); }
          */
             //  highlightNeighbors(clickedTerritory);
           }
           else if(!isGameFinished && !firstTurn)
           {
              setStatus("It is not your turn. Turn is now at "+players[currentPlayer].name); // TODO: Add whose turn is now
             // console.log("suanda current",currentPlayer);
           }

        }


    // TODO: Server Side FUNCTION NEED TO BE HANDLED
        function fortifyRequest(){
          var fortifyInfartryNumber = element('fortifyinfantrynumber');
          for (var i = 0; i < fortifyInfartryNumber; i++)
          {
            putInfantry(fortifyTerritoryFrom);
          }
        }


        function reinforcePhaseStyle(){
          if(currentPlayer == USER.pid && !firstTurn)
          {
            if(currentPhase != REINFORCEMENT)
            { currentPhase = REINFORCEMENT; }

            reinforceBtn.style.backgroundColor = '#09821B';
            nextPhaseBtn.disabled = false;
          }
        }

        function attackPhaseStyle(){
          if(currentPlayer == USER.pid)
          {
            setStatus("Please select a territory to ATTACK FROM.");
            reinforceBtn.disabled = true;
            attackBtn.style.backgroundColor = '#9E0E15';
          }
        }

        function confirmAttack(){
         resetHeighlightofNeighBors(attackTerritoryFrom);
         resetHighlightTerritory(attackTerritoryFromLayer);
         attackTerritoryToLayer.closePopup();
         attackTerritoryToLayer.unbindPopup();
      //   highlightAttackables(attackTerritoryFrom);
         nextPhaseBtn.disabled = false;
         attackFrom = null;
         isCancelled = true;
         socket.emit('startWar', {attacker: attackTerritoryFrom, defender: attackTerritoryToSave});
          attackTerritoryToSave = null;
          attackTerritoryTo = null;
       }

// Function that makes necessary actions after player cancels the attack
       function cancelAttack(){
         resetHeighlightofNeighBors(attackTerritoryFrom);
         resetHighlightTerritory(attackTerritoryFromLayer);
         attackTerritoryToSave = null;
         attackTerritoryToLayer.closePopup();
         attackTerritoryToLayer.unbindPopup();
         attackTerritoryTo = null;
      //   highlightAttackables(attackTerritoryFrom);
         nextPhaseBtn.disabled = false;
         attackFrom = null;
         isCancelled = true;
       }



        function confirmFortify(amount){

         var fortifyAmount = element('fortifyamount').value;
         resetHeighlightofNeighBors(fortifyTerritoryFrom);
         resetHighlightTerritory(fortifyTerritoryFromLayer);
         fortifyTerritoryToLayer.closePopup();
         fortifyTerritoryToLayer.unbindPopup();
      // highlightAttackables(attackTerritoryFrom);
         nextPhaseBtn.disabled = false;
         fortifyFrom = null;
         isCancelled = true;
         socket.emit('fortification', {fortifyfrom: fortifyTerritoryFrom, fortifyto: fortifyTerritoryToSave, amount: fortifyAmount});
         fortifyTerritoryToSave = null;
         fortifyTerritoryTo = null;
       }



    // Function that makes necessary actions after player cancels the fortify action
       function cancelFortify(){
         resetHeighlightofNeighBors(fortifyTerritoryFrom);
         resetHighlightTerritory(fortifyTerritoryFromLayer);
         fortifyTerritoryToSave = null;
         fortifyTerritoryToLayer.closePopup();
         fortifyTerritoryToLayer.unbindPopup();
         fortifyTerritoryTo = null;
      // highlightAttackables(attackTerritoryFrom);
         nextPhaseBtn.disabled = false;
         fortifyFrom = null;
         isCancelled = true;
       }

        function fortifyPhaseStyle(){
          if(currentPlayer == USER.pid)
          {

            if(attackTerritoryFromLayer != undefined && attackTerritoryTo != null ){
              resetHighlightTerritory(attackTerritoryFromLayer);
              resetHeighlightofNeighBors(attackTerritoryFrom);
              attackTerritoryFromLayer = undefined;
              attackTerritoryTo = null;
            }

            setStatus("Please select your territory to fortify.");
            attackBtn.disabled = true;
            fortifyBtn.style.backgroundColor = '#FF5900';
            nextPhaseBtn.disabled = false;
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

            if(fortifyTerritoryFromLayer != undefined && fortifyTerritoryTo != null ){
              resetHighlightTerritory(fortifyTerritoryFromLayer);
              resetHeighlightofNeighBors(fortifyTerritoryFrom);
              fortifyTerritoryFromLayer = undefined;
              fortifyTerritoryTo = null;
            }

          //  countriesLayer.resetStyle(lastClickedTerritory);
        }

        function nextPhase(){
            if(currentPhase == REINFORCEMENT)
            {
              currentPhase = ATTACK;
              reinforceBtn.disabled = true;
              attackBtn.disabled = false;
              attackPhaseStyle();
            }
            else if(currentPhase == ATTACK)
            {
              currentPhase = FORTIFY;
              fortifyBtn.disabled = false;
              fortifyPhaseStyle();
            }
            else if(currentPhase == FORTIFY)
            {
              firstTurn = false;
              endTurnStyle();
            }
        }


      // TODO: Did he really played or not? check please
        function endTurnStyle(){
          if(currentPlayer == USER.pid)
          {
              socket.emit('endturn', {gameid: gameid, userid: USER.pid});
              resetAttributes();
              //reinforcePhaseStyle(); /////////////////// CAN BE DELETED!!
              currentPhase = REINFORCEMENT;
              //nextTurn();
          }
        }

        // Gets infantry number of the territory
        function getInfantry(layer)
        {
           return layer.feature.properties.ARMYCOUNT;
        }

        //  feature function
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

          // checks if the country is enable to attack clicked country first parametre Attacker second one is Defender
        function canAttack(tid,tid1){
          for(var j = 0; j < territories[tid].neighbors.length; j++){
            if(territories[tid].neighbors[j] == tid1 && territories[territories[tid].neighbors[j]].ownsto != territories[tid].ownsto )
            { return true; }
          }
          return false;
         }

          // checks if the country is enable to attack clicked country first parametre Attacker second one is Defender
        function canFortify(tid, tid1){
          for(var j = 0; j < territories[tid].neighbors.length; j++){
            if(territories[tid].neighbors[j] == tid1 && territories[territories[tid].neighbors[j]].ownsto == territories[tid].ownsto )
            { return true; }
          }
          return false;
         }

        // Highlights atackable neighbors of clicked country
        function highlightAttackables(tid)// Highlighting of a attackables of a territory with a territoryid
        {
          var attackables = 0;
          for(var j = 0; j < territories[tid].neighbors.length; j++){
            if(territories[territories[tid].neighbors[j]].ownsto != territories[tid].ownsto)
            {
              highlightTerritory(mapTerritories[territories[tid].neighbors[j]]);
              attackables++;
            }
          }
          return attackables;
        }

        // Highlights Fortifyable neighbors of clicked country
        function highlightFortifyables(tid)// Highlighting of a fortifyable of a territory with a territoryid
        {
          var fortifyables = 0;
          for(var j = 0; j < territories[tid].neighbors.length; j++){
            if(territories[territories[tid].neighbors[j]].ownsto == territories[tid].ownsto)
            {
              fortifyables++;
              highlightTerritory(mapTerritories[territories[tid].neighbors[j]]);
            }
          }

          return fortifyables;
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

    // TODO: Maybe add some delay to organize sockets
        function putInfantry(tid)
        {
          //var ctid = mapTerritories.indexOf(layer);
          // socket.emit('putinfantry', {tid: tid});
          socket.emit('reinforcement', {pid: USER.pid, tid: tid});
        }

        function updateMapInfantries(tid, infantry, ownsto){
          var territoryLayer = mapTerritories[tid];
          if(ownsto == 0){
            countryLabel = 'countryLabel0';
          }

          else if (ownsto == 1){
            countryLabel = 'countryLabel1';
          }

          else if(ownsto == 2){
            countryLabel = 'countryLabel2';
          }
          else if(ownsto == 3){
            countryLabel = 'countryLabel3';
          }

          else if(ownsto == 4){
            countryLabel = 'countryLabel4';
          }

          else if(ownsto == 5){
            countryLabel = 'countryLabel5';
          }

          map.closeTooltip(territoryLayer.getTooltip()); // Close old tooltip
          territoryLayer.feature.properties.ARMYCOUNT = infantry + 1;
          territoryLayer.bindTooltip((infantry).toString(), {permanent:true,direction:'center',className: countryLabel});
        }

        var element = function(id)
        {
            return document.getElementById(id);
        }

        var messages = element('messages');
        var gamelogs = element('gamelog');
        var textarea = element('textarea');

        inputSocketEvents();
        outputSocketEvents();

        function inputSocketEvents(){
        //  console.log(gameid+"yrark");
        if (creater != username){
            socket.emit('joingame', {username: username});
          }
        }

        function Attack() //let server know attacking action
        {
          socket.emit('startWar', {attacker: attackTerritoryFrom, defender: attackTerritoryToSave});
        }


        function outputSocketEvents(){
        // Handle Output Events
            socket.on('updatedterritory', function(data){

              if(data.length)
              {
              if(initialization)
              {
                territories = data;
                initialization = false;
              }
                for (i = 0; i < data.length; i++)
                {
                  //var deneme = data[i].tid;

                    updateMapInfantries(data[i].tid, data[i].infantry, data[i].ownsto);
                    territories[data[i].tid] = data[i];
                }
              }
            });

            //joinGame();



             socket.on('getplayers', function(data){
              if(data.length > 0)
              {
                console.log("players: ",data);
                for (i = 0; i < data.length; i++)
                {
                  players[i] = data[i];
                  if(username == players[i].name){
                    USER = players[i];
                    console.log("My name is"+username+"and i will be the"+players[i]);
                  }
                }
                
              }

                for (i = 0; i < data.length; i++)
                {
                  if(players[i].name == "x")
                  {
                    setStatus("We are still waiting for some people!");
                    break;
                  }
                  else if(i==data.length-1){ // it traversed all the names but could not found
                    firstTurn = false; // Now game can start
                    setStatus("The game has started.");
                    socket.emit('getcurrentplayer', {gameid: gameid});
                    break;
                  }
                }

            });


             socket.on('currentplayer', function(data){
              if(data.length > 0)
              {
                console.log(data[0][0].currentplayer);
                setTurn(data[0][0].currentplayer);
              }
            });

              // Handle Output Events
            socket.on('allmessages', function(data){
              if(data.length)
              {
                for (i = 0; i < data.length; i++)
                {
                  var chatMessage = document.createElement('div');
                  chatMessage.id = 'chatmsgs';
                  var message = document.createElement('div');
                  chatMessage.innerHTML = '';
                  chatMessage.innerHTML = chatMessage.innerHTML + "<b>"+ data[i].name +"</b>: " + data[i].message;
                  messages.append(chatMessage);
                }
              }
              $("#messages").scrollTop($('#messages')[0].scrollHeight);
            });

            socket.on('leftinfantry', function(data){

              if(data.length)
              {
                leftInfantry = data[0].infantry;
                if(currentPlayer == USER.pid && data[0].infantry > 0){
                  setStatus("You have "+ data[0].infantry.toString() + " infantry left.");
                }
                else if(currentPhase == REINFORCEMENT && currentPlayer == USER.pid && data[0].infantry == 0)
                {
                  setStatus("You do not have any infantry left.");
                }
              }
            });

               socket.on('currentplayer', function(data){

              if(data.length)
              {
                for (i = 0; i < data.length; i++)
                {
                    setTurn(data[0][i].currentplayer);
                }
              }
            });

            socket.on('gamefinish', function(data){
              if(data.length)
              { finishGame(data[0].winner); }

            });

        }



      // Style of features
        function finishGame(winner)
        {
            isGameFinished = true;
            reinforceBtn.disabled = true;
            attackBtn.disabled = true;
            fortifyBtn.disabled = true;
            nextPhaseBtn.disabled = true;

            if(USER.pid == winner)
            {
             setStatus("Congratulations you won the game!");
            }
            else
            {
             setStatus("Game over! " + players[winner].name + " has won the game!");
            }

            for (var k = 0; k < mapTerritories.length; k++){
                map.closeTooltip(mapTerritories[k].getTooltip());
                if(USER.pid == winner)
                {
                mapTerritories[k].setStyle({ weight : 3, color: 'purple', fillColor:'purple', fillOpacity: 0.5});
                }
                else
                {
                mapTerritories[k].setStyle({ weight : 3, color: 'black', fillColor:'black', fillOpacity: 0.5});
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

  /*
        L.Map = L.Map.extend({
          openPopup: function(popup) {
                      // this.closePopup();  // just comment this
              this._popup = popup;
              return this.addLayer(popup).fire('popupopen', {
                  popup: this._popup
              });
          }
        });
  */

        if(maplevel == "hard"){
        countriesLayer = L.geoJson( countries, { style : countriesStyle, onEachFeature : countriesOnEachFeature}).addTo(map);
        }
        else if(maplevel == "medium"){
        countriesLayer = L.geoJson( countries30, { style : countriesStyle, onEachFeature : countriesOnEachFeature}).addTo(map);
        }
        else {
          countriesLayer = L.geoJson( countries, { style : countriesStyle, onEachFeature : countriesOnEachFeature}).addTo(map);
        }

      // It is used for legends - > We can use it to add control panel or sth else
        var gameStatusLegend = L.control({position : 'topright'});
        var controlPanelLegend = L.control({position : 'bottomright'});

        gameStatusLegend.onAdd = function(map)
        {
          var div = L.DomUtil.create('div','legend');
          div.innerHTML = '<div class="container"><h4><div id="gamestatus">Press end turn to finish the turn.</div></h4></div>';
          return div;
        }

        controlPanelLegend.onAdd = function(map)
        {
          var div = L.DomUtil.create('div','legend');
          div.innerHTML = '<div class="container"><button id="reinforcebutton" type="button" class="btn btn-reinforce btn-lg" onClick="reinforcePhaseStyle()">Reinforce</button> <button id="attackbutton" type="button" class="btn btn-attack btn-lg" disabled>Attack</button> <button id="fortifybutton" type="button" class="btn btn-fortify btn-lg" disabled>Fortify</button> <button id="nextphasebutton" type="button" class="btn btn-fortify btn-lg" onClick ="nextPhase()" disabled>NEXT PHASE</button></div>';
          return div;
        }

        gameStatusLegend.addTo(map);
        controlPanelLegend.addTo(map);

      // HTML PART

              // Get element
              var gameStatus = element('gamestatus');
              //var username = element('username');
              var clearBtn = element('clear');
              var nextPhaseBtn = element('nextphasebutton');
              var reinforceBtn = element('reinforcebutton');
              var attackBtn = element('attackbutton');
              var fortifyBtn = element('fortifybutton');
              var fortifyBtn = element('fortifybutton');


              reinforceBtn = element('reinforcebutton');
              //reinforceBtn.addEventListener('onClick', reinforcePhaseStyle());
              //nextPhaseBtn.addEventListener('onClick', nextPhase());

              // Set default status
              var statusDefault = gameStatus.textContent;

              function setUser(){
                var userid = element('userid').value;
                currentplayer = userid;
                USER = players[userid];
                setStatus("You are: "+ USER.pid);
              }
              // Set the status
              var setStatus = function(s){
                gameStatus.textContent = s;
              }



              socket.emit('getmsgs', {gameid: gameid});

            if(socket !== undefined)
            {
              console.log("Socket connected to server.");
            }

                // Handle Output Events
                socket.on('outputmsg', function(data){

                    if(data.length)
                    {
                        for (i = 0; i < data.length; i++)
                        {
                            var chatMessage = document.createElement('div');
                            chatMessage.id = 'chatmsgs';
                            var message = document.createElement('div');
                            chatMessage.innerHTML = '';

                            chatMessage.innerHTML = chatMessage.innerHTML + "<b>" +data[i].name +"</b>: " + data[i].message;

                            messages.append(chatMessage);
                            //messages.insertBefore(message, messages.firstChild);
                        }
                    }

                    $("#messages").scrollTop($('#messages')[0].scrollHeight);

                });



            // Get Status from Server
            socket.on('serverstatus', function(data){
                    if(data.length)
                    {
                      setStatus(data[0]);
                    }
            });


            // Get Status from Server
            socket.on('gamelog', function(data){

                    if(data.length)
                    {
                        for (i = 0; i < data.length; i++)
                        {
                            var gameLogMessage = document.createElement('div');
                            gameLogMessage.id = 'gamelogs';
                            var gamelog = document.createElement('div');
                            gameLogMessage.innerHTML = '';

                            gameLogMessage.innerHTML = gameLogMessage.innerHTML + data[i];

                            gamelogs.append(gameLogMessage);
                            //messages.insertBefore(message, messages.firstChild);
                        }
                    }

                    $("#gamelog").scrollTop($('#gamelog')[0].scrollHeight);

            });



                // Handle Input
                textarea.addEventListener('keydown', function(event){
                    if(event.which === 13 && event.shiftKey == false){ // enter tusu
                        // Emit to server input
                        socket.emit('newmessage', {
                            gameid: gameid,
                            name:USER.name,
                            message:textarea.value
                        });
                        textarea.value = '';
                        event.preventDefault();
                    }
                });


window.onbeforeunload = function (e) {
    e = e || window.event;

    // For IE and Firefox prior to version 4
    if (e) {
        e.returnValue = 'Are you sure to close the web site?';
    }
    // For Safari
    return 'Sure?';
};