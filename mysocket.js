(function(){
    		var element = function(id)
    		{
    			return document.getElementById(id);
    		}

    		// Get element
    		var status = element('status');
    		var messages = element('messages');
    		var textarea = element('textarea');
    		var username = element('username');
    		var clearBtn = element('clear');

    		// Set default status
    		var statusDefault = status.textContent;

    		// Set the status
    		var setStatus = function(s){
    			status.textContent = s;

                /*
    			if(s !== statusDefault)
	    		{
	    			var delay = setTimeOut(function(){
	    				setStatus(statusDefault);
	    			}, 4000); // 4 seconds later
	    		}
                */

    		}

    		// Connect to socket.io
			var socket = io.connect();

    		if(socket !== undefined)
    		{
    			console.log("Socket connected to server.");
    		}


    		// Handle Output Events
    		socket.on('output', function(data){
    			
    			if(data.length)
    			{
    				for (i = 0; i < data.length; i++)
    				{
    					var message = document.createElement('div');
    					messages.setAttribute('class', 'chat-message');
    					message.textContent = data[i].name+ ": " + data[i].message;
    					messages.append(message);
    					//messages.insertBefore(message, messages.firstChild);
    				}
    			}
    			console.log(data);
    		});

    		// Get Status from Server
    		socket.on('status', function(data){
    			// get message status
    			setStatus((typeof data === 'object') ? data.message: data);

    			// If status is clear, clear text
    			if(data.clear)
    			{
    				textarea.value = '';
    			}
    		});


    		// Handle Input
    		textarea.addEventListener('keydown', function(event){
    			if(event.which === 13 && event.shiftKey == false){ // enter tuşu
    				// Emit to server input
    				console.log(textarea.value);
    				socket.emit('input', {
    					name:username.value,
    					message:textarea.value
    				}); 
                    textarea.value = '';
    				event.preventDefault();
    			}
    		});


    	})(); 