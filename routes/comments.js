const express = require("express");
//need mergeParams since later we need req.params.id which is no longer include in the routes here
const router = express.Router({mergeParams:true});
const campground = require("../models/campgrounds");
const Comment = require("../models/comment");

function isLoggedin(req,res,next){
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}
// ##########################
//comment routes
router.get("/new",isLoggedin,function(req,res){
    campground.find({_id:req.params.id},function(err,campground){
        if (err) {
            console.log(err);
        }
        else {
            console.log("here");
            res.render("comments/new",{campground:campground});
        }
    })
    
});
router.post("/",isLoggedin, function (req, res) {
    campground.find({_id:req.params.id},function(err,campground){
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        }
        else {
            Comment.create(req.body.comment, function (err, newComment) {
                if (err) {
                    console.log(err);
                }
                else {
                    campground[0].comments.push(newComment);
                    campground[0].save();
                    res.redirect("/campgrounds/"+req.params.id);
                }
            });           
        }
    });  
});

module.exports = router;
