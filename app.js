const express = require('express');
const app = express();
const bodyparser = require("body-parser");
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const campground = require("./models/campgrounds");
const Comment = require("./models/comment");
const seedDB = require("./seeds");
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require("./models/user");
const session = require("express-session");
const flash = require("connect-flash");
// require all the routes
const commentRoutes = require("./routes/comments");
const campgroundRoutes = require("./routes/campgrounds");
const authRoutes = require("./routes/index");

app.use(bodyparser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(flash());
app.use(express.static(__dirname + "/public"));
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

// pass currentUser paras to every route since we use it in header.ejs, which is included in every ejs file
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//use routes
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments/",commentRoutes);
app.use(authRoutes);

const url = process.env.MONGODB_URI;
// open a connection to the test database on our locally running instance of MongoDB
mongoose.connect(url||'mongodb://localhost/yelp_camp', { useNewUrlParser: true,useCreateIndex:true, useUnifiedTopology: true ,useFindAndModify: false}, function (err) {
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



var port = process.env.PORT||3000;
app.listen(port, function(){
    console.log(`App listening at http://localhost:${port}`);
});