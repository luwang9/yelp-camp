const express = require("express");
const router = express.Router();
const campground = require("../models/campgrounds");
const Comment = require("../models/comment");
const middleware = require("../middleware");

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
router.post("/",middleware.isLoggedin, function (req, res) {
    name = req.body.name;
    image = req.body.image;
    price = req.body.price;
    description = req.body.description;
    author = {
        id:req.user._id,
        username : req.user.username
    };
    newCamp = { name: name,price:price, image: image ,description:description,author:author};
    campground.create(newCamp, function (err, newCamp) {
        if (err) {
            console.log(err);
        }
        else {
            req.flash("success","Successfully added a campground");

            res.redirect("/campgrounds");
        }
    })
});
//show form to create new campground
router.get("/new",middleware.isLoggedin, function (req, res) {
    res.render("campgrounds/new");
});
//show more info about one campground
router.get("/:id", function (req, res) {
    campground.findById(req.params.id).populate("comments").exec(function (err, FindCampground) {
        if (err||!FindCampground) {
            req.flash("error","Failed to find the campground!");
            res.redirect("back");
        }
        else {  
            res.render("campgrounds/show", { campground: FindCampground });
        }
    });
})
//edit campground route
router.get("/:id/edit",middleware.checkedCampgroundOwnership,function(req,res){
    campground.findById(req.params.id,function(err,foundCampground){
        if (err||!foundCampground) {
            req.flash("error","Failed to find the campground!");
            res.redirect("back");
        }
        else {
            res.render("campgrounds/edit",{campground:foundCampground});
        }
    })
});
router.put("/:id",middleware.checkedCampgroundOwnership,function(req,res){
    campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
        if (err) {
            req.flash("error","Failed to find the campground!");
            res.redirect("/campgrounds");
        }
        else {
            req.flash("success","Successfully updated a campground");

            res.redirect("/campgrounds/"+req.params.id);
        }
    })
})
//destroy campground route
router.delete("/:id",middleware.checkedCampgroundOwnership,function(req,res){
    campground.findByIdAndDelete(req.params.id,function(err,removedCampground){
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        }
        else {
            Comment.deleteMany({_id: { $in: removedCampground.comments } },function(err){
                if (err) {
                    console.log(err)
                }
                else {
                    req.flash("success","Successfully deteled a campground");

                    res.redirect("/campgrounds");
                }
            })
            
        }
    })
});


module.exports = router;
