const campground = require("../models/campgrounds");
const Comment = require("../models/comment");
var middlewareObj = {};

//authentication middleware
middlewareObj.isLoggedin = function(req,res,next){
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error","You need to be logged in first");
    res.redirect("/login");
}
//authorization of comment
middlewareObj.checkedCommentOwnership =  function(req,res,next){
    if (req.isAuthenticated()) {
        Comment.find({_id:req.params.comment_id},function(err,foundComment){
            if (err) {
                req.flash("error","Campground is not found");
                res.redirect("back");
            } else {
                if (foundComment[0].author.id.equals(req.user._id)) {
                    next();
                }
                else {
                    req.flash("error","You need permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error","You need to be logged in first");
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
                    req.flash("error","You cannot do that since you are not the owner");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error","You need to be logged in first");
        res.redirect("back");
    }

}
module.exports = middlewareObj;