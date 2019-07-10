const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const PORT = process.env.PORT || 5000;
const path = require('path');
server.listen(PORT, () => console.log(`Server started on ${PORT}`));

//Init middleware
app.use(express.json({extended: true}));

var generateNewId = () => { return (new Date).getTime().toString('16') };


app.get('/', function (req, res) {
    //res.sendFile(path.resolve(`${__dirname}/../client/index.html`));
    let newId = generateNewId();
    console.log('-newId-->',newId);
    res.redirect(`/game/${newId}`);

  });

app.get('/game/:uniqueId', function (req, res) {
    //res.sendFile(path.resolve(`${__dirname}/../client/index.html`));
    let theUniqueId = req.params.uniqueId;
    console.log('-req.params.id-->',theUniqueId);
    res.send(`Hello--> ${theUniqueId}`);

  });