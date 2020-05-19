const app = require('express')();
const bodyparser = require("body-parser");
const mongoose = require('mongoose');
const path = require('path');
const campground = require("./models/campgrounds");
const Comment = require("./models/comment");
const seedDB = require("./seeds");
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

seedDB();


app.get("/campgrounds", function (req, res) {
    campground.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("campgrounds/index", { campgrounds: allCampgrounds });
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
app.get('/campgrounds/:id/comments/new',function(req,res){
    campground.find({_id:req.params.id},function(err,campground){
        if (err) {
            console.log(err);
        }
        else {
            res.render("comments/new",{campground:campground});
        }
    })
    
});
app.post("/campgrounds/:id/comments", function (req, res) {
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
                    // campground.forEach(function(campground){
                    //     campground.comments.push(newComment);
                    //     campground.save();
                    //     res.redirect("/campgrounds/"+req.params.id);
                    // });
                }
            });           
        }
    });  
});



app.listen(app.listen(port, () => console.log(`App listening at http://localhost:${port}`)));