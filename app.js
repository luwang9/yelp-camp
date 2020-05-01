const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.get("/",function(req,res){
    res.render("landing");

});
app.get("/campgrounds",function(req,res){
    var a = [
        {name:"Tamarack at Running Fox Berry Farm",image:"https://tentrrimg.imgix.net/ffdd54e3-2b85-11e8-8e68-0adc64bdfa55/6e18abb9-6f80-11ea-a275-0a932d599b6f_SITE_PROFILE.jpeg?fit=crop&crop=focalpoint&fp-z=1&fp-y=0.5&fp-x=0.5&h=200&w=260"},
        {name:"Beerocracy Colonial Camp",image:"https://tentrrimg.imgix.net/fecd3d53-9416-11e8-a8eb-0adc64bdfa55/1323f728-4f3f-11e9-958d-0a932d599b6f_SITE_PROFILE.jpeg?fit=crop&crop=focalpoint&fp-z=1&fp-y=0.5&fp-x=0.5&h=200&w=260"},
        {name:"Cove Creek Forest",image:"https://tentrrimg.imgix.net/fd3703a4-1f2f-11e9-90fb-0e1671378d08/b8514858-9922-11e9-96a8-0e9d39187912_SITE_PROFILE.jpeg?fit=crop&crop=focalpoint&fp-z=1&fp-y=0.5&fp-x=0.5&h=200&w=260"}
    ];
    res.render("campgrounds",{campgrounds:a});
});


app.listen(app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`)));