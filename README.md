# Run the app

You will need MongoDB installed on your computer, start the service, create a database, and create a user to interact with that database.  Don't worry if you do not understand all the commands; this tutorial is not a MongoDB tutorial!

```bash 
mongo

use test_db

db.createUser(
    {
        user: "yourname",
        pwd: "yourpassword",
        roles: [ "readWrite", "dbAdmin" ]
    }
)

db.createCollection("users")

db.users.insert( { name: "Zach", email: "zach@email.com", profileUrl: "https://someurl.com/image.png" })
```

```
# Set your environment variables
# Same as above!
export DB_USER=yourname
export DB_PW=yourpassword

# Download dependencies
npm install 
```

For maximum separation of duties, I have implemented a simple static server that runs the `index.html` file and an API server that makes the API in the business layer available.  In order to run the app, we will need to run both of these, so open up two terminals and the run the following commands.

```bash 
# Terminal 1
npm run start-api
```

```bash 
# Terminal 2
npm run start-static-html
```

If you want to run it all in a single terminal, execute the following command:

```bash 
npm run all-in-one
```

# Explanation 

In this repository is a layered software architecture as explained in my blog post: [How to Build a Production Web Application Part 4: Architecture](https://zachgoll.github.io/blog/2019/build-production-web-app-part-4/)

A layered architecture (also called "n-tier") describes a system of (usually) 3-4 layers that are responsible for separate duties ([separation of concerns](https://en.wikipedia.org/wiki/Separation_of_concerns)).  Each layer can use the layer directly below it, but not vice-versa.  A simple layered architecture as shown in this repository may have the following three layers: 

1. Presentation Layer
2. Business Layer
3. Data Layer

![layered architecture diagram](layered-architecture.png)

The key feature of a layered architecture is that each layer is completely independent and does not require any knowledge of what the other layers are doing.  This is great if you have several teams working on an application at once.  The only thing that each layer must know is the _structure_ of the data that the layer below it will be passing to it.

In some cases, you may have a shared services layer that has utility functions.  Since these functions are not specific to any one part of the application, we can define rules that allow any layer to access this utility layer.  Notice in the diagram below how some of the layers are marked "open" and some of them are marked "closed".  The layer marked "open" is the shared utility functions layer which can be used by any of the other layers.  The rest of the layers are marked "closed" which indicates that these layers can only use the layers directly below them.

![layered architecture diagram](layered-architecture-with-utils.png)

## Example

Let's say you are working on a user profile page where the user has a name, email, and photo.  Throughout this example, I will show you how the layers interact to get the user data _from the database to the web page_.

I will be using ExpressJS and MongoDB to demonstrate.

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
// File: data-layer-user.js
const mongoose = require('mongoose');

// User schema for mongodb
const UserSchema = mongoose.Schema({
	name: { type: String },
	email: { type: String },
	profileUrl: { type: String }
}, { collection: 'users' } );

// Define the mongoose model for use below in method
const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserByEmail = (email, callback) => {
      try {
            User.findOne({ email: email }, callback);
      } catch (err) {
            callback(err);
      }
};
```

### Business Layer

The business layer does not need to know what the code in the data layer looks like.  The business layer only needs to know that if it calls the `getUserByEmail(email)` method from `data-layer-user.js`, it will receive a name, email, and url to the profile's photo.

So here is a file from the business layer that will use the data layer to get the user.

```javascript
// File: business-layer-user.js

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
```

What we have done here in the business layer is create a simple API.  If we visit our application at the path `/get-user/:user-email`, we should receive a data object back in the form of JSON.  The business layer has called the data layer's `getUserByEmail(email)` method without knowing the code behind it.

### Presentation Layer

To recap, we have `data-layer-user.js` in the data layer which exposes the method `getUserByEmail(email)`, and `business-layer-user.js` in the business layer which exposes an API router of `/get-user/:user-email` over HTTP.  The presentation layer is the layer that the client will directly interact with.

The presentation layer only needs to know the data structure of the response given by the API call `/get-user/:user-email`.  It does not need to know how that API endpoint is implemented, and certainly doesn't need to know how the `getUserByEmail(email)` function from the data layer works.

The presentation layer is usually initiated by a user action.  For simplicity, we'll assume that to retrieve your user profile, you must click a button to submit a form where the only input is your email.  So the user clicks a button, and the presentation layer implements the following method: 

```javascript
// File: presentation-layer-user.jsf

function getDataFromBusinessLayer() {
    event.preventDefault();
    const email = $('#email').val();

    // Perform the GET request to the business layer
    $.get(`/get-user/${email}`, (user) => {
        
        // displays the retrieved data on screen (see file for full function)

    });
}
```

This will make a call to the business layer which will make a call to the data layer which will make a call to the actual database.

