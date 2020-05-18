const mongoose = require("mongoose");

var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"comments"
        }
    ]
});
// export a mongoose model, in  app.js can use require to get this mongoose model 
//"campgrounds" refers to the collection name in the mongodb.
module.exports= mongoose.model("campgrounds", campgroundSchema);
