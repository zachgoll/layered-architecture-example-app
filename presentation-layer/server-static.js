var express = require('express');
var app = express();

app.use(express.static('presentation-layer'));

app.listen(8080);
console.log("App is running at http://localhost:8080")