const mongoose = require("mongoose");
const campground = require("./models/campgrounds");
const Comment = require("./models/comment");
data = [
    {
        name: "Tamarack at Running Fox Berry Farm",
        image: "https://tentrrimg.imgix.net/ffdd54e3-2b85-11e8-8e68-0adc64bdfa55/6e18abb9-6f80-11ea-a275-0a932d599b6f_SITE_PROFILE.jpeg?fit=crop&crop=focalpoint&fp-z=1&fp-y=0.5&fp-x=0.5&h=200&w=260",
        description: "A unique campsite in the Western Berkshire Hills of Massachusetts.This campsite is located on a picturesque slice of nature tucked in the woods surrounded by over 53 acres. Nestled in the woods, campers will be able to enjoy plenty of walking trails, areas for biking, fishing, swimming, kayak and canoe and multiple cultural attractions nearby."
    },
    {
        name: "Beerocracy Colonial Camp",
        image: "https://tentrrimg.imgix.net/fecd3d53-9416-11e8-a8eb-0adc64bdfa55/1323f728-4f3f-11e9-958d-0a932d599b6f_SITE_PROFILE.jpeg?fit=crop&crop=focalpoint&fp-z=1&fp-y=0.5&fp-x=0.5&h=200&w=260",
        description: "Unique campsite getaway at New York State's only dedicated cask ale brewery, nestled in the heart of the Finger Lakes wine region."
    },
    {
        name: "Cove Creek Forest",
        image: "https://tentrrimg.imgix.net/fd3703a4-1f2f-11e9-90fb-0e1671378d08/b8514858-9922-11e9-96a8-0e9d39187912_SITE_PROFILE.jpeg?fit=crop&crop=focalpoint&fp-z=1&fp-y=0.5&fp-x=0.5&h=200&w=260",
        description: "Mountain hideaway campsite on a regenerative farm."
    }
];
function seedDB() {
    // remove all campground
    Comment.remove({},err=>{
        if (err) {
            console.log(err);
        }
        else {
            console.log("remove all comments");
        }
    });
    campground.remove({}, function (err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("remove all campgrounds");
            data.forEach(element => {
                campground.create(element,(err,campground)=>{
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log("create a campground");
                        var com = {
                            text: "blablabla",
                            author: "Homer",
                        };
                        Comment.create(com,(err,comment)=>{
                            if (err) {
                                console.log(err);
                            }
                            else {
                                campground.comments.push(comment);
                                campground.save();
                                console.log("added a comment");
                            }
                        });
                        
                    }
                });
            });

        }
        
    });
    
}
module.exports = seedDB;