const mongoose = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
    username: String,
    password: String,
});
//by plugin adds all the methods  to schema
userSchema.plugin(passportLocalMongoose);

// export a mongoose model, in  app.js can use require to get this mongoose model 
//"users" refers to the collection name in the mongodb.
module.exports= mongoose.model("users", userSchema);
