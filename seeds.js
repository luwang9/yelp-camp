const mongoose = require("mongoose");
const campground = require("./models/campgrounds");
const Comment = require("./models/comment");
data = [
    {
        name: "Cloud's Rest", 
        price: "34.56",
        image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        author:{
            id : "588c2e092403d111454fff76",
            username: "Jack"
        }
    },
    {
        name: "Desert Mesa", 
        price: "66.76",
        image: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        author:{
            id : "588c2e092403d111454fff71",
            username: "Jill"
        }
    },
    {
        name: "Canyon Floor", 
        price: "12.99",
        image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        author:{
            id : "588c2e092403d111454fff77",
            username: "Jane"
        }
    }
]
 
function seedDB() {
    // remove all campground
    Comment.deleteMany({},err=>{
        if (err) {
            console.log(err);
        }
        else {
            console.log("remove all comments");
        }
    });
    campground.deleteMany({}, function (err) {
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
                        console.log("created a campground");
                        
                        var com = {
                            text: "This place is great, but I wish there was internet",
                            author:{
                                id : "588c2e092403d111454fff76",
                                username: "Jack"
                            }
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