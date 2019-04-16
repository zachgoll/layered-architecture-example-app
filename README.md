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

var mongoose = require('mongoose');

// Put your mongoose configurations here
const UserSchema = mongoose.Schema({
    name: { type: String },
    email: { type: String },
    profile_photo: { type: String }
});

// Export the User model so that we can access the methods on it in other layers
const User = module.exports = mongoose.model.('User', UserSchema);

module.exports.getUserByEmail = (email, callback) => {
    try {
        User.findOne({ email: email }, callback);
    } catch (err) {
        callback(err);
    }
}
```

### Business Layer

The business layer does not need to know what the code in the data layer looks like.  The business layer only needs to know that... 

If it imports the `dal-user.js` file and calls `getUserByEmail`, it will get data in the form of 

```
name: { type: String },
email: { type: String },
profile_photo: { type: String }
```

So here is a file from the business layer that will use the data layer to get the user.

```javascript
// bl = business layer
// File: bl-user.js
var User = require('dal-user.js');
var router = require('express').Router();

router.get('/get-user/:user-email', (req, res, next) => {
    User.getUserByEmail()
});
