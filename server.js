const express = require("express");
var mongoose = require('mongoose');
const bodyParser = require('body-parser');
var path = require('path');

const app = express();
//connect Database
mongoose.connect('mongodb://localhost/devconnector', { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false });
require('./config/mongoose.js');


//Init Middleware
app.use(express.json({ extend: false }));

// app.get('/', (req, res) => res.send('API Running'));

//Define Routes
app.use('/api/user', require('./routes/api/user'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/post', require('./routes/api/post'));

if (process.env.NODE_ENV === 'production') {
    // Set static folder 
    app.use(express.static('client/build')); 
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html')); 
    });
  }
//defaults to 5000
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));