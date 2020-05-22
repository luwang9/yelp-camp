const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
//###########################

router.get("/", function (req, res) {
    res.render("landing");
});
//Auth routes
//show register form
router.get("/register",function(req,res){
    res.render("register");
});
router.post("/register",function(req,res){

    User.register(new User({username: req.body.username}),req.body.password,function(err,user){
        if (err) {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/campgrounds");
        });
    });
});

//show login form
router.get("/login",function(req,res){
    res.render("login");
});
router.post("/login", passport.authenticate('local',
    {
        //successRedirect: "/campgrounds",
        failureRedirect: "/login", 
        //failureFlash: true
    }), function (req, res) {
        res.redirect("/campgrounds");
    });
router.get("/logout",function(req,res){
    req.logout();
    req.flash("error","Logged you out!");
    res.redirect("/campgrounds");
});
module.exports = router;