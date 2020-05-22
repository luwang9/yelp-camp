const campground = require("../models/campgrounds");
const Comment = require("../models/comment");
var middlewareObj = {};

//authentication middleware
middlewareObj.isLoggedin = function(req,res,next){
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}
//authorization of comment
middlewareObj.checkedCommentOwnership =  function(req,res,next){
    if (req.isAuthenticated()) {
        Comment.find({_id:req.params.comment_id},function(err,foundComment){
            if (err) {
                res.redirect("back");
            } else {
                if (foundComment[0].author.id.equals(req.user._id)) {
                    next();
                }
                else {
                    console.log("You are not the owner!");
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }

}

//Authorization  middleware
middlewareObj.checkedCampgroundOwnership = function(req,res,next){
    if (req.isAuthenticated()) {
        campground.find({_id:req.params.id},function(err,foundCampground){
            if (err) {
                res.redirect("back");
            } else {
                if (foundCampground[0].author.id.equals(req.user._id)) {
                    next();
                }
                else {
                    console.log("You are not the owner!");
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }

}
module.exports = middlewareObj;