const mongoose = require("mongoose");

var commentSchema = new mongoose.Schema({
    text: String,
    author: {
        id: {
            type:mongoose.Schema.Types.ObjectId,
            // ref:"users" here comments is the collection name in mongodb
            ref:"users"
        },
        username: String       
    }
});
// export a mongoose model, in  app.js can use require to get this mongoose model 
//"comments" refers to the collection name in the mongodb.
module.exports= mongoose.model("comments", commentSchema);

