const express = require('express');
require('dotenv').config();
const app = express();
const Keyv = require('keyv');
const mongoURI = process.env.MONGO_URL || 'mongodb://localhost:27017';
const uuid = require('uuid');
const Model = require('./Model');
const modelSchema = require('./Schema');
const bp = require('body-parser');

const server = new Model({
  name: 'Server',
  storeURI: mongoURI,
  schema: modelSchema,
});

app.use(bp.urlencoded({ extended: true }));
app.use(bp.json());
app.use((req, res, next) => {
  console.log(`Received a ${req.method} request from ${req.ip} for ${req.url}`);
  next();
});

app.use('/model', require('./Routes')(server));

const port = process.env.PORT || 3200;
app.listen(port, err => {
  if (err) console.error(err);
  console.log('Listening on port: ' + port + ' !');
});
