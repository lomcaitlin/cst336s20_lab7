var express = require("express");
var bodyParser = require("body-parser");
var app = express();

var request = require("request");

app.use(express.static('css'));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

var imgs = [];
var likes = [];
app.get("/", function(req, res){
	res.render("index", {imgs:imgs, likes:likes});
});

app.post("/getImages", function(req, res){
    // var newFriend = req.body.newfriend;
    // friends.length = 0;
    // friends.push(newFriend);
    // res.redirect("/");
    let keyword = req.body.keyword;
    let orientation = req.body.orientation; 
    console.log("keyword: " + keyword + " || orientation: " + orientation);
    imgs.length = 0;
    likes.length = 0;
    request(`https://pixabay.com/api/?key=15450300-8689de85a05ab8af4132e7434&q=${keyword}&orientation=${orientation}`, function (error, response, body) {
        // console.error('error:', error); // Print the error if one occurred
        // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        // console.log('body:', body); // Print the HTML for the Google homepage.

        if (!error && response.statusCode == 200) {
            let parsedData = JSON.parse(body);
            var done = [];
            for (let i = 0; i < 4; i++) {
                let itemNum = Math.floor(Math.random() * parsedData.hits.length);
                while (true) {
                    let pass = true;
                    itemNum = Math.floor(Math.random() * parsedData.hits.length);
                    for (let j = 0; j < done.length; j++) {
                        if (itemNum === done[j]) {
                            pass = false;
                        }
                    }
                    if (pass == true) {
                        done[i] = itemNum;
                        let imgLink = parsedData.hits[itemNum].webformatURL;
                        let imgLikes = parsedData.hits[itemNum].likes;
                        console.log("imgLink: " + imgLink);
                        console.log("imgLikes: " + imgLikes);
                        imgs.push(imgLink);
                        likes.push(imgLikes);
                        break;
                    }
                }
            }
            // res.render("index", {"img1":parsedData.hits[done[1]].webformatURL, "likes1":parsedData.hits[done[1]].likes, "img2":parsedData.hits[done[2]].webformatURL, "likes2":parsedData.hits[done[2]].likes, "img3":parsedData.hits[done[3]].webformatURL, "likes3":parsedData.hits[done[3]].likes, "img4":parsedData.hits[done[4]].webformatURL, "likes4":parsedData.hits[done[4]].likes,});
            // // res.send(`<img src='${parsedData.hits[randomIndex].largeImageURL}'>`);
            // res.render("index", {"image":parsedData.hits[randomIndex].largeImageURL});
        }
        else {
            console.log(response.statusCode);
            console.log(error);
        }
    });

    res.redirect("/");
 });

 app.get("*", function(req, res){
    res.send("<h2 style='color: red;'> Sorry, Page not found !</h2>"); 
 });

 app.listen(process.env.PORT || 3000, function(){
    console.log("Server has been started");
})