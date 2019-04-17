var express = require('express');
var app = express();
var mongoose = require('mongoose');
var User = require('../data-layer/data-layer-user');

// Connect to running database
mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PW}@127.0.0.1:27017/test_db`, 
    {useNewUrlParser: true});

// set the view engine to ejs
app.set('view engine', 'ejs');

// Tells Express app where the base directory for static files is. 
// If you go to http://localhost:8080/presentation-layer-user.js
// you will see the javascript file.
app.use(express.static('presentation-layer'));

// index page 
app.get('/', (req, res) => {
   res.render('../presentation-layer/index'); 
});

// API Call
app.get('/get-user/:useremail', function(req, res) {
    const user = User.getUserByEmail(req.params.useremail, (error, user) => {
        res.status(200).json({ name: user.name, email: user.email, profileUrl: user.profileUrl });
    });    
});

app.listen(8080);
console.log("Visit app at http://localhost:8080")