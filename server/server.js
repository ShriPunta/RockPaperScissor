const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const PORT = process.env.PORT || 5000;
const path = require('path');
const mongoDBConfig = require('../config/keys');
server.listen(PORT, () => console.log(`Server started on ${PORT}`));
const clientPath =`${__dirname}/../client`;
console.log(`Serving static from ${clientPath}`);

//Init middleware
app.use(express.json({extended: true}));

// Static files
app.use(express.static(clientPath));


// DB Config

MongoClient
  .connect(
    mongoDBConfig.mongoConnectURI,
    { useNewUrlParser: true },
    function(err, mongoCallback){
        if(err){
            console.log('Entered error');
            throw err;
        }

        console.log('Mongo connected Successfully -->');
        

        const db = mongoCallback.db(mongoDBConfig.mongoDBName);
        
        io.on('connection', (currConnSock) => {
          let chat = db.collection('chats');

          console.log('Someone connected');

          // Write a function to send status to the newly connected client
          var sendStatus = (s) => {
            currConnSock.emit('status',s);
          };
          //currConnSock.emit('message', 'Hi you are connected');


          // Get chats from Moongo database
          chat.find().limit(100).sort({_id:1}).toArray(function(err, res){
            if(err){
              throw err;
            }

            // Emit the messages
            currConnSock.emit('output', res);
          });

          // Handle input events if someone types something from the client, we will handle it here
          io.on('input', function(data){
            let name = data.name;
            let msg = data.msg;


            // Null check for name and message
            // Also handle this on the client side
            if(name == '' || msg == ''){
              sendStatus('Please enter a name and meesgae');
            } else{
              // Insert the sent message to MongoDB
              chat.insert({name: name, message:message}, function(){

                // Whatever the client sends, he should also see it on his screen, so we emit it back
                currConnSock.emit('output', [data]);

                //Send status obj
                sendStatus({
                  message : 'Message sent',
                  clear : true
                });
              });
            }
          });

          // Handle clear
          io.on('clear', function(data){
            // Remove all chats from the collection in Mongo
            chat.remove({}, function(){
              // EMit cleared
              currConnSock.emit('cleared');
            });
          });

        });



      }
  );


var generateNewId = () => { return (new Date).getTime().toString('16') };


app.get('/', function (req, res) {
    //res.sendFile(path.resolve(`${__dirname}/../client/index.html`));
    res.send('index.html');
    let newId = generateNewId();
    console.log('-newId-->',newId);
    //res.redirect(`/game/${newId}`);

  });

app.get('/game/:uniqueId', function (req, res) {
    //res.sendFile(path.resolve(`${__dirname}/../client/index.html`));
    let theUniqueId = req.params.uniqueId;
    console.log('-req.params.id-->',theUniqueId);
    res.send(`Hello--> ${theUniqueId}`);

  });