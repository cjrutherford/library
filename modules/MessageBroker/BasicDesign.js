const express = require('express');
const app = express();
const server = require('http').createServer(app);

const io = require('socket.io')(server);

const port = process.env.PORT || 3200;
server.listen(port, (err) => {
    if(err) console.error(err);
    console.log('Listening on port: ' + port + ' !');
});