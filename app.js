const app = require('express')();
const bodyparser = require("body-parser");
const mongoose = require('mongoose');
const path = require('path');
const campground = require("./models/campgrounds");
const seedDB = require("./seeds");
seedDB();
// const comment = require("./models/comment");
const port = 3000;
app.use(bodyparser.urlencoded({ extended: true }))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.get("/", function (req, res) {
    res.render("landing");

});
// //connect to mongodb on ec2 instance
// mongoose.connect('mongodb://localhost/yelp_camp', { useNewUrlParser: true, useUnifiedTopology: true });


// open a connection to the test database on our locally running instance of MongoDB
mongoose.connect('mongodb://localhost/yelp_camp', { useNewUrlParser: true, useUnifiedTopology: true });
// get notified if we connect successfully or if a connection error occurs
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Database Connected!')
});



app.get("/campgrounds", function (req, res) {
    campground.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("index", { campgrounds: allCampgrounds });
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
    res.render("new");
})
app.get('/campgrounds/:id', function (req, res) {
    campground.find({_id: req.params.id}).populate("comments").exec(function (err, FindCampground) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("show", { campground: FindCampground });
        }
    });
})

app.listen(app.listen(port, () => console.log(`App listening at http://localhost:${port}`)));