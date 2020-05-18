const mongoose = require("mongoose");

var commentSchema = new mongoose.Schema({
    text: String,
    author: String
});
// export a mongoose model, in  app.js can use require to get this mongoose model 
//"comments" refers to the collection name in the mongodb.
module.exports= mongoose.model("comments", commentSchema);

