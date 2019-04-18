var express = require('express');
var app = express();
var cors = require('cors');
var mongoose = require('mongoose');
var User = require('../data-layer/data-layer-user');

// This will allow our presentation layer to retrieve data from this API without
// running into cross-origin issues (CORS)
app.use(cors());

// Connect to running database
mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PW}@127.0.0.1:27017/test_db`, 
    {useNewUrlParser: true});

// API Call
app.get('/get-user/:useremail', function(req, res) {
    const user = User.getUserByEmail(req.params.useremail, (error, user) => {
        res.status(200).json({ name: user.name, email: user.email, profileUrl: user.profileUrl });
    });    
});

app.listen(8081);
console.log("App is running at http://localhost:8081");