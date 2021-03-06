const express = require("express");
//need mergeParams since later we need req.params.id which is no longer include in the routes here
const router = express.Router({mergeParams:true});
const campground = require("../models/campgrounds");
const Comment = require("../models/comment");
const middleware = require("../middleware");
// ##########################
//comment routes
router.get("/new",middleware.isLoggedin,function(req,res){
    campground.findById(req.params.id,function(err,campground){
        if (err) {
            console.log(err);
        }
        else {
            res.render("comments/new",{campground:campground});
        }
    })
    
});
router.post("/",middleware.isLoggedin, function (req, res) {
    campground.findById(req.params.id,function(err,campground){
        if (err||!campground) {
            req.flash("error","Failed to find the campground!");
            res.redirect("/campgrounds");
        }
        else {
            Comment.create(req.body.comment, function (err, newComment) {
                if (err) {
                    req.flash("error","Failed to create a comment");
                    console.log(err);
                }
                else {
                    newComment.author.id = req.user._id;
                    newComment.author.username = req.user.username;
                    newComment.save(); 
                    campground.comments.push(newComment);
                    campground.save();
                    req.flash("success","Successfully added a comment");
                    res.redirect("/campgrounds/"+req.params.id);
                }
            });           
        }
    });  
});
//edit routes
router.get("/:comment_id/edit",middleware.checkedCommentOwnership,function(req,res){
    campground.findById(req.params.id,function(err,foundCampground){
        if (err||!foundCampground) {
            req.flash("error","Campground is not found");
            res.redirect("back");
        }
        else {
            Comment.findById(req.params.comment_id, function(err,foundComment){
                if (err||!foundComment) {
                    req.flash("error","Failed to find the comment!");
                    res.redirect("back");
                }
                else {
                    res.render("comments/edit",{campground:foundCampground,comment:foundComment});                }
            })
        }
    })
    
});
//update comment
router.put("/:comment_id",middleware.checkedCommentOwnership,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedcomment){
        if (err) {
            res.redirect("back");
        }
        else {
            req.flash("success","Successfully updated a comment");

            res.redirect("/campgrounds/"+req.params.id);
        }
    })
});
//comment destroy route
router.delete("/:comment_id",middleware.checkedCommentOwnership,function(req,res){
    Comment.findByIdAndDelete(req.params.comment_id,function(err){
        if (err) {
            res.redirect("back");
        }
        else {
            req.flash("success","Successfully deleted a comment");
            res.redirect("/campgrounds/"+ req.params.id);               
        }        
    })
});



module.exports = router;
