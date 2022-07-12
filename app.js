//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
// var posts = [];

const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

// Database connection and initialization.
mongoose.connect(
  "mongodb+srv://admin:2292001@todolist.4lgnpgc.mongodb.net/BlogWebsite?retryWrites=true&w=majority"
);
let postSchema = mongoose.Schema({
  title: String,
  body: String,
});
let Post = mongoose.model("post", postSchema);

// Handle GET requests.
app.get("/", (req, res) => {
  Post.find({}, (err, posts) => {
    res.render("home", {
      homeStartingContent: homeStartingContent,
      posts: posts,
    });
  });
});
app.get("/:page", (req, res) => {
  console.log("get req for a page");
  let requestedPage = _.lowerCase(req.params.page);
  console.log(requestedPage);
  switch (requestedPage) {
    case "contact":
      res.render("contact", { contactContent: contactContent });
      break;
    case "about":
      res.render("about", { aboutContent: aboutContent });
      break;
    case "compose":
      res.render("compose", {});
      break;
    default:
      res.redirect("/");
  }
});

app.get("/posts/:id", (req, res) => {
  let postId = req.params.id;
  Post.findOne({ _id: postId }, (err, requestedPost) => {
    if (err) res.redirect("/");
    else {
      res.render("post", {
        postTitle: requestedPost.title,
        postBody: requestedPost.body,
      });
    }
  });
});

app.post("/compose", (req, res) => {
  let postTitle = req.body.title;
  let postBody = req.body.body;
  console.log("post title: " + postTitle + "\npost body: " + postBody);
  Post.create({ title: postTitle, body: postBody });
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000");
});
