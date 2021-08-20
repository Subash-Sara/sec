require('dotenv').config()// to keep sec code safe
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
var encrypt = require('mongoose-encryption'); // to encrypt the collection

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//
const uri = "mongodb+srv://subash:nodMup-6hyfmu-dotsuk@cluster0.r8t9c.mongodb.net/credentialsDb?retryWrites=true&w=majority";
mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
  email: String,
  pass: String
});
// -=-=-encrypting-==-=-// password encryption

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["pass"]});

const User = mongoose.model("user", userSchema);

app.get("/", function(req, res) {
  res.render("home")

});

app.get("/login", function(req, res) {
  res.render("login")

});

app.post("/login", function(req, res) {
  let eName = req.body.username;
  let ePass = req.body.password;
  User.find(function(err, foundCredentials) {
    if (!err) {
      foundCredentials.forEach(function(credential) {
        if (credential.email == eName && credential.pass == ePass) {
          res.render("secrets")
          console.log(" matching found");
        } else {
          console.log("no matching credentials found");
        }
      })
    } else {
      console.log("retriving failled with error in login " + err);
    }
  });
});

app.get("/register", function(req, res) {
  res.render("register")

});

app.post("/register", function(req, res) {
  const userReg = new User({
    email: req.body.username,
    pass: req.body.password
  });
  userReg.save(function(err) {
    if (!err) {

      console.log("Successfully added a new user");
      //res.render("secrets")
    } else {
      console.log("err while register= " + err);
    }
  })
  res.redirect("/")
});

//-=-=-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-Server listen-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-=-=-=-=-
app.listen(3000, function() {
  console.log("hai da mapla server 3000 la irundu")
})
