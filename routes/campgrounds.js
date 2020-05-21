const express = require("express");
const router = express.Router();
const campground = require("../models/campgrounds");

//show campground page
router.get("/", function (req, res) {
    campground.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("campgrounds/index", { campgrounds: allCampgrounds});
        }
    });
});
//add one campground
router.post("/",isLoggedin, function (req, res) {
    name = req.body.name;
    image = req.body.image;
    description = req.body.description;
    author = {
        id:req.user._id,
        username : req.user.username
    };
    newCamp = { name: name, image: image ,description:description,author:author};
    campground.create(newCamp, function (err, newCamp) {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect("/campgrounds");
        }
    })
});
//show form to create new campground
router.get("/new",isLoggedin, function (req, res) {
    res.render("campgrounds/new");
});
//show more info about one campground
router.get("/:id", function (req, res) {
    campground.find({_id: req.params.id}).populate("comments").exec(function (err, FindCampground) {
        if (err) {
            console.log(err);
        }
        else {  
            res.render("campgrounds/show", { campground: FindCampground[0] });
        }
    });
})
//edit campground route
router.get("/:id/edit",function(req,res){
    campground.find({_id:req.params.id},function(err,foundCampground){
        if (err) {
            console.log(err);
            res.redirect("/camgrounds");
        }
        else {
            res.render("campgrounds/edit",{campground:foundCampground[0]});
        }
    })
});
router.put("/:id",function(req,res){
    campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        }
        else {
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
})
//destroy campground route
router.delete("/:id",function(req,res){
    campground.findByIdAndDelete(req.params.id,function(err){
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        }
        else {
            res.redirect("/campgrounds");
        }
    })
});
//middleware
function isLoggedin(req,res,next){
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;
