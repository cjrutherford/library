const express = require('express');
const app = express();
const Keyv = require('keyv');
const mongoURI = process.env.MONGO_URL || 'mongodb://localhost:27017';
const uuid = require('uuid');
const Model = require('./Model');
const modelSchema = require('./Schema');

const server = new Model({
    name: 'Server', mongoURI, modelSchema
});



app.use((req,res, next) => {
    console.log(`Received a ${req.method} request from ${req.ip} for ${req.url}`);
    next();
});


app.use('/model', require('./Routes')(server));


const port = process.env.PORT || 3200;
app.listen(port, (err) => {
    if(err) console.error(err);
    console.log('Listening on port: ' + port + ' !');
});