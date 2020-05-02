const express = require('express');
const app = express();
const bodyparser = require("body-parser");
const mongoose = require('mongoose');

const path = require('path');
const port = 3000;
app.use(bodyparser.urlencoded({ extended: true }))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.get("/", function (req, res) {
    res.render("landing");

});
// open a connection to the test database on our locally running instance of MongoDB
mongoose.connect('mongodb://localhost/yelp_camp', { useNewUrlParser: true, useUnifiedTopology: true });
// get notified if we connect successfully or if a connection error occurs
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Database Connected!')
});

var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
});
var campground = mongoose.model('campground', campgroundSchema);
// campground.create([
//     {
//         name: "Tamarack at Running Fox Berry Farm",
//         image: "https://tentrrimg.imgix.net/ffdd54e3-2b85-11e8-8e68-0adc64bdfa55/6e18abb9-6f80-11ea-a275-0a932d599b6f_SITE_PROFILE.jpeg?fit=crop&crop=focalpoint&fp-z=1&fp-y=0.5&fp-x=0.5&h=200&w=260",
//         description: "A unique campsite in the Western Berkshire Hills of Massachusetts.This campsite is located on a picturesque slice of nature tucked in the woods surrounded by over 53 acres. Nestled in the woods, campers will be able to enjoy plenty of walking trails, areas for biking, fishing, swimming, kayak and canoe and multiple cultural attractions nearby."
//     },
//     {
//         name: "Beerocracy Colonial Camp",
//         image: "https://tentrrimg.imgix.net/fecd3d53-9416-11e8-a8eb-0adc64bdfa55/1323f728-4f3f-11e9-958d-0a932d599b6f_SITE_PROFILE.jpeg?fit=crop&crop=focalpoint&fp-z=1&fp-y=0.5&fp-x=0.5&h=200&w=260",
//         description: "Unique campsite getaway at New York State's only dedicated cask ale brewery, nestled in the heart of the Finger Lakes wine region."
//     },
//     {
//         name: "Cove Creek Forest",
//         image: "https://tentrrimg.imgix.net/fd3703a4-1f2f-11e9-90fb-0e1671378d08/b8514858-9922-11e9-96a8-0e9d39187912_SITE_PROFILE.jpeg?fit=crop&crop=focalpoint&fp-z=1&fp-y=0.5&fp-x=0.5&h=200&w=260",
//         description: "Mountain hideaway campsite on a regenerative farm."
//     }
// ], function (err, campground) {
//     if (err) {
//         console.log(err);
//     }
//     else {
//         console.log('Newly created campgrounds');
//         console.log(campground);
//     }
// });

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
    campground.find({_id: req.params.id}, function (err, FindCampground) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("show", { campground: FindCampground });
        }
    });
})

app.listen(app.listen(port, () => console.log(`App listening at http://localhost:${port}`)));