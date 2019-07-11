const sock = io();

// Custom function just to select elements
var element = function(id){
    return document.getElementById(id); 
};

var status = element('status');
var messages = element('messages');
var textarea = element('textarea');
var username = element('username');
var clearbtn = element('clear');

// Default status is to be blank, it will be initialised so
var statusDefault = status.textContent;

// Function to set status
var setStatus = function(s){
    status.textContent = s; 

    // CLear out the status after an interval
    if(s !== statusDefault){
        setTimeout(function(){
            setStatus(statusDefault);
        }, 4000);
    }


}
if(sock !== undefined){
    
    sock.on('output', (data) => {
        console.log('Connected to socket on the client side.')

        var messages = document.getElementById('messages');
        console.log('--->',data);
        if(data){
                console.log('--data-->', data);
                console.log('--data-->', data.length);
                for(let i=0; i < data.length; i++){
                    console.log('--Entered->',data[i]);
                    // Build out the message div
                    var msg = document.createElement('div');
                    msg.setAttribute('class', 'chat-message');
                    msg.textContent = data[i].name + ": " + data[i].message;
                    messages.appendChild(msg);
                    messages.insertBefore(msg, messages.firstChild);

                }
            }
        
    });

    // get the status from the server
    sock.on('status', function(data){
        // get message status
        setStatus((typeof data === 'object') ? data.message : data);

        // if status is clear
        if(data.clear){
            textarea.value = '';
        }
    });

    textarea.addEventListener('keydown', function(evt){
        if(event.which === 13 && event.shiftKey == false){
            console.log('Enter pressed');
            // Emit to server input
            sock.emit('input', {
                name : username.value,
                message : textarea.value
    
            });
            textarea.value = '';
    
            evt.preventDefault();
        }
    });

    clearbtn.addEventListener('click', function(){
        sock.emit('clear');
    });
    

    sock.on('cleared', function(){
        messages.textContent = '';
    });
}




