const sock = io();

sock.on('message', (data) => {

    var messages = document.getElementById('messages');
    console.log('--->',data);
    if(data){
            console.log('--data-->', data);
            console.log('--data-->', data.length);
            for(let i=0; i < data.length; i++){
                console.log('--Entered->');
                // Build out the message div
                var msg = document.createElement('div');
                msg.setAttribute('class', 'chat-message');
                msg.textContent = data[i].name + ": " + data[i].message;
                messages.appendChild(msg);
                messages.insertBefore(msg, messages.firstChild);

            }
        }
    
});

var textarea = document.querySelector("#textarea");

textarea.addEventListener('keydown', function(evt){
    if(event.which === 13 && event.shiftKey == false){
        console.log('Enter pressed');
        // Emit to server input
        sock.emit('message', {
            name : 'Def',
            message : textarea.value

        });
        textarea.value = '';

        evt.preventDefault();
    }
   
})


