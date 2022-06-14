
const express = require('express');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const { Server } = require('http');
const bodyParser = require('body-parser');
  
const app = express();

  
// Set up Global configuration access
dotenv.config();
app.use(express.json());
app.use(bodyParser.json());
//const PORT1 = process.env.API_PORT;

let PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Server is up and running on localhost:'+ PORT);
});


module.exports = create_server;