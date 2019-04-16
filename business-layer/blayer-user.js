var express = require('express');
var app = express();
var db = require('../mock-database/db');

// set the view engine to ejs
app.set('view engine', 'ejs');

// index page 
app.get('/', (req, res) => {
   res.send("home")
   //res.render('../presentation-layer/index'); 
});

// API Call
app.get('/get-user/:useremail', function(req, res) {
    const user = db.getUserByEmail(req.params.useremail);

    // Yes, this is in the business layer and references a view from the presentation layer
    // so one could technically argue that this "depends on" the presentation layer and 
    // is not a perfect layered architecture
    res.render('../presentation-layer/index', {user: user} );
});

app.listen(8080);
console.log("Visit app at http://localhost:8080")