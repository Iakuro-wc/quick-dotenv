//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

mongoose.connect(('mongodb://localhost:27017/userDB'), {useNewUrlParser: true});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

const User = new mongoose.model('User', userSchema);

app.get('/', (req, res) => {
  res.render('home');
});

app.route('/login')

.get((req, res) => {
  res.render('login');
})

.post((req, res) => {
  const password = req.body.password;
  User.findOne({email: req.body.username}, (err, foundUser) => {
    if(foundUser) {
      if(foundUser.password === password){
        res.render('secrets');
      }  else {
        res.send("Incorrect User information <a href='/login'>Please Try Again</a>")
      }
    }
  });
});

app.route('/register')

.get((req, res) => {
  res.render('register');
})

.post((req, res) => {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save((err) => {
    if(!err){
      res.render('secrets');
    }
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Now listening on port 3000");
});
