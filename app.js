const app = require('express')();
const bodyparser = require("body-parser");
const mongoose = require('mongoose');
const path = require('path');
const campground = require("./models/campgrounds");
const Comment = require("./models/comment");
const seedDB = require("./seeds");
const port = 3000;
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require("./models/user");
const session = require("express-session");

app.use(bodyparser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//passport config
app.use(session({
     secret: "cats",
     resave: false,
     saveUninitialized: false
     }));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// pass currentUser paras to every route
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
})
function isLoggedin(req,res,next){
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}


app.get("/", function (req, res) {
    res.render("landing");
});

// open a connection to the test database on our locally running instance of MongoDB
mongoose.connect('mongodb://localhost/yelp_camp', { useNewUrlParser: true, useUnifiedTopology: true }, function (err) {
    if (err) {
        console.log('Could not connect to mongodb on localhost. Ensure that you have mongodb running on localhost and mongodb accepts connections on standard ports!');
    }
});
// get notified if we connect successfully or if a connection error occurs
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Database Connected!')
});

seedDB();


app.get("/campgrounds", function (req, res) {
    campground.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("campgrounds/index", { campgrounds: allCampgrounds,currentUser:req.user });
        }
    });
});
app.post("/campgrounds", function (req, res) {
    name = req.body.name;
    image = req.body.image;
    description = req.body.description;
    newCamp = { name: name, image: image ,description:description};
    campground.create(newCamp, function (err, newCamp) {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect("/campgrounds");
        }
    })
});
app.get("/campgrounds/new", function (req, res) {
    res.render("campgrounds/new");
});
app.get('/campgrounds/:id', function (req, res) {
    campground.find({_id: req.params.id}).populate("comments").exec(function (err, FindCampground) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("campgrounds/show", { campground: FindCampground });
        }
    });
})




// ##########################
//comment routes
app.get('/campgrounds/:id/comments/new',isLoggedin,function(req,res){
    campground.find({_id:req.params.id},function(err,campground){
        if (err) {
            console.log(err);
        }
        else {
            res.render("comments/new",{campground:campground});
        }
    })
    
});
app.post("/campgrounds/:id/comments",isLoggedin, function (req, res) {
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

//###########################
//Auth routes
//show register form
app.get("/register",function(req,res){
    res.render("register");
});
app.post("/register",function(req,res){

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
app.get("/login",function(req,res){
    res.render("login");
});
app.post("/login", passport.authenticate('local',
    {
        //successRedirect: "/campgrounds",
        failureRedirect: "/login", 
        //failureFlash: true
    }), function (req, res) {
        res.redirect("/campgrounds");
    });
app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/campgrounds");
});
app.listen(app.listen(port, () => console.log(`App listening at http://localhost:${port}`)));