const express = require("express");
const router = express.Router();
const campground = require("../models/campgrounds");
//index routes
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
router.get("/new",isLoggedin, function (req, res) {
    res.render("campgrounds/new");
});
router.get("/:id", function (req, res) {
    campground.find({_id: req.params.id}).populate("comments").exec(function (err, FindCampground) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("campgrounds/show", { campground: FindCampground });
        }
    });
})
function isLoggedin(req,res,next){
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;
