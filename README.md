# Run the app

```
npm install 
npm run start 
```

# Explanation 

In this repository is a layered software architecture as explained in my blog post: [How to Build a Production Web Application Part 4: Architecture](https://zachgoll.github.io/blog/2019/build-production-web-app-part-4/)

A layered architecture (also called "n-tier") describes a system of (usually) 3-4 layers that are responsible for separate duties ([separation of concerns](https://en.wikipedia.org/wiki/Separation_of_concerns)).  Each layer can use the layer directly below it, but not vice-versa.  A simple layered architecture as shown in this repository may have the following three layers: 

1. Presentation Layer
2. Business Layer
3. Data Layer

![layered-architecture.png](layered architecture diagram)

The key feature of a layered architecture is that each layer is completely independent and does not require any knowledge of what the other layers are doing.  This is great if you have several teams working on an application at once.  The only thing that the layers must know is the structure and arrangement of data that it needs to process.

## Example

Let's say you are working on a user profile page where the user has a name, email, and photo.  Throughout this example, I will show you how the layers interact to get the user data from the database to the web page.

I will be using ExpressJS and a mock database which will return replicated data to demonstrate.

### Data Layer

We will assume that the user is already stored in the database (data layer) like so: 

```
{
    "_id": {
        "$oid": "5c15e9bd9b05b32b7dd022bd"
    },
    "name": "Zach",
    "email": "zach@email.com",
    "profile_photo": "https://someurltophoto.com/profile-photo.png"
}
```

Within the data layer, there is a method exposed called `getUserByEmail(email)` that will return this database record when the correct email is passed as an argument: 

```javascript
// dal = data access layer 
// File: dal-user.js
var db = require('../mock-database/db');

module.exports.getUserByEmail = (email) => {
      return db(email);
};
```

### Business Layer

The business layer does not need to know what the code in the data layer looks like.  The business layer only needs to know that if it calls the `getUserByEmail(email)` method from `dal-user.js`, it will receive a name, email, and url to the profile's photo.

So here is a file from the business layer that will use the data layer to get the user.

```javascript
// blayer = business layer
// File: blayer-user.js

var express = require('express');
var app = express();
var db = require('../mock-database/db');

// set the view engine to ejs
app.set('view engine', 'ejs');

// index page 
app.get('/', function(req, res) {
    
    const data = db();

    // Yes, this is in the business layer and references a view from the presentation layer
    // so one could technically argue that this "depends on" the presentation layer and 
    // is not a perfect layered architecture
    res.render('../presentation-layer/home', {data: data} );
});

app.listen(8080);
console.log("Visit app at http://localhost:8080")
```

What we have done here in the business layer is create a simple API.  If we visit our application at the path `/get-user/:user-email`, we should receive a data object back in the form of JSON.  The business layer has called the data layer's `getUserByEmail(email)` method without knowing the code behind it.

### Presentation Layer

To recap, we have `dal-user.js` in the data layer which exposes the method `getUserByEmail(email)`, and `blayer-user.js` in the business layer which exposes an API router of `/get-user/:user-email` over HTTP.  The presentation layer is the layer that the client will directly interact with.

The presentation layer only needs to know the data structure of the response given by the API call `/get-user/:user-email`.  It does not need to know how that API endpoint is implemented, and certainly doesn't need to know how the `getUserByEmail(email)` function from the data layer works.

The presentation layer is usually initiated by a user action.  For simplicity, we'll assume that to retrieve your user profile, you must click a button to submit a form where the only input is your email.  So the user clicks a button, and the presentation layer implements the following method: 

```javascript
function onUserProfileButtonClick(email) {
    
}
```
