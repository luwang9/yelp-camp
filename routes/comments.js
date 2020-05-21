const express = require("express");
//need mergeParams since later we need req.params.id which is no longer include in the routes here
const router = express.Router({mergeParams:true});
const campground = require("../models/campgrounds");
const Comment = require("../models/comment");

// ##########################
//comment routes
router.get("/new",isLoggedin,function(req,res){
    campground.find({_id:req.params.id},function(err,campground){
        if (err) {
            console.log(err);
        }
        else {
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
                    newComment.author.id = req.user._id;
                    newComment.author.username = req.user.username;
                    newComment.save(); 
                    campground[0].comments.push(newComment);
                    campground[0].save();
                    res.redirect("/campgrounds/"+req.params.id);
                }
            });           
        }
    });  
});
//edit routes
router.get("/:comment_id/edit",function(req,res){
    campground.find({_id:req.params.id},function(err,foundCampground){
        if (err) {
            console.log(err);
            res.redirect("back");
        }
        else {
            Comment.find({_id:req.params.comment_id}, function(err,foundComment){
                if (err) {
                    console.log(err);
                    res.redirect("back");
                }
                else {
                    res.render("comments/edit",{campground:foundCampground[0],comment:foundComment[0]});                }
            })
        }
    })
    
});
//update comment
router.put("/:comment_id",function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedcomment){
        if (err) {
            res.redirect("back");
        }
        else {
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
});

//authentication middleware
function isLoggedin(req,res,next){
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}
module.exports = router;
