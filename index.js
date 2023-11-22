// requiring express server
const express = require('express');
const mongoose = require('mongoose');  // requiring the mongoose module
const passport = require('passport');  // requiring the passport module
const bodyParser = require('body-parser');  // Express body-parser is an npm module used to process data sent in an HTTP request body. It provides four express middleware for parsing JSON, Text, URL-encoded, and raw data sets over an HTTP request body
const LocalStrategy = require('passport-local');  // Passport is authentication middleware for Node.js.
const passportLocalMongoose = require('passport-local-mongoose');   //Passport-Local Mongoose is a Mongoose plugin that simplifies username creation and password login with Passport.
const https = require("https");
const flash = require('connect-flash');
const session = require('express-session')
require('dotenv').config('./.env');
const app = express();  // firing up the express server

// Models
const Message = require('./models/Message');
const Journey = require('./models/Journey');
const User = require('./models/Users');
const Place = require('./models/Places');


let check = 0;
let user='John Doe';

app.use(express.static('public'));
// mongoose.connect('mongodb://127.0.0.1:27017/myapp',{useNewUrlParser:'true'});

// Atlas key
const uri= `${process.env.uri}`;
// const uri= `${process.env.mong}`;
// const uri= `${process.env.uri1}`;
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(()=>{console.log("database connected")});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: 'Rusty is a dog',
  resave: false,
  saveUninitialized: false
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());


// ROUTES
// home page
app.get('/' , function(req,res){
  res.render('home',{imageFileName: 'hero_bg.jpg',check:check});
});
app.get('/ltc',(req,res)=>{
  if(check==1){
    res.render('ltc');
  }
  else{
    res.render('login');
  }
})
app.get('/railway',(req,res)=>{
  res.render('railway')
})
app.get('/bills',(req,res)=>{
  if(check==1){
    res.render('bills');
  }
  else{
    res.render('login');
  }
})
app.get('/extra',(req,res)=>{
  res.render('extra')
})

app.get('/get_started',function(req,res){
  if(check==1){
    res.render('get_started',{image: 'bg1.jpg'});
  }
  else{
    res.render('login');
  }
  
})
app.get('/profile', (req, res) => {
  // Check for success flash messages
  const successMessage = req.flash('success');
  
  // Render the dashboard with the success message
  res.render('profile', { successMessage });
});
// ticket page
app.get('/tickets',(req,res) => {
  res.redirect('https://www.irctc.co.in/nget/train-search');
});
app.get('/hotels',(req,res) => {
  res.redirect('https://www.makemytrip.com/hotels/five_star-hotels-indore.html');
});
// register page 
app.get('/register' , function(req,res){
  res.render('register');
});

// destination handle
app.post('/destination',function(req,res){  
  console.log(req.body.place1);
  if(req.body.place1 == "bhopal"){
    // Render the EJS template and pass dynamic data
    const token1 = `${process.env.token1}`;
    const latitude = 23.2599;
    const longitude = 77.4126;
    const city="bhopal";
    
    // Render the EJS template and pass dynamic data
    res.render('bhopal', { token1, latitude, longitude,city,});
    // res.render('bhopal');
  }
  else if(req.body.place1 == "indore"){
    const city=req.body.place1;
    const token2= `${process.env.token2}`;
    const latitude = 22.719569;
    const longitude = 75.857726;
    res.render('indore',{token2,city,latitude,longitude});
  }
  else{
    res.render('home',{imageFileName: 'hero_bg.jpg',check:check});
  }
})

// upper lake of bhopal route 
app.get('/upperLake',function(req,res){
  res.redirect('https://en.wikipedia.org/wiki/Bhojtal');
});
app.get('/karSeva',function(req,res){
  res.redirect('https://bhopal.tourismindia.co.in/kerwa-dam-bhopal');
});
app.get('/gulkandMahal',function(req,res){
  res.redirect('https://bhopal.tourismindia.co.in/gohar-mahal-bhopal');
});

app.post("/register",(req,res)=>{
  console.log(req.body);
  const newUser= new User({
    email :  req.body.email,
    name :   req.body.name,
    password: req.body.password
  });
  
  check = 1;
  user=req.body.name;
  newUser.save().then(()=>{
    
    res.render('home',{imageFileName: 'hero_bg.jpg',check:check});
    
  })
  .catch((err)=>{
    console.log("Error: koi to gadbad hai");
    res.render('register');
  })
});


// router for login form 
app.get('/login', function (req, res) {
  
  if(check==1){
    res.render('home',{imageFileName: 'hero_bg.jpg',check:check});
  }
  else{
    res.render('login');
  }
  
});

app.post("/login",(req,res)=>{
  const username = req.body.email;
  const password = req.body.password;
  
  User.findOne({email : username}).then((foundUser) => {
    if(foundUser.password===password){
      user=foundUser.name;
      // console.log(user);
      check = 1;
      res.render('home',{imageFileName: 'hero_bg.jpg',check:check});
    }
    else{
      res.render("login");
    }
  })
  .catch((err)=>{
    console.log(err);
  })     
});

//Handling user logout 
app.get("/logout", function (req, res) {
  check = 0;
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});
        
// Forum data---------------------------------------------------------------------------------------

app.get('/forum', async (req, res) => {
  if(check==1){
    try {
      const messages = await Message.find().sort({ createdAt: 'asc' });
      const places = await Place.find().sort({ createdAt: 'asc' });
      res.render('discuss', { messages, places, user });
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  }
  else{
    res.render('login');
  }
});
        
app.post('/add-message', async (req, res) => {
  const {city, message } = req.body;
  const place=req.body.city;
  try {

    await Message.create({ user, city , message });
    await Place.create({place});
    res.redirect('/forum');
  } catch (err) {
    console.error(err);
    await Message.create({ user, city , message });
    res.redirect('/forum');
  }
});

//Route for handling the search
  app.get('/search', async (req, res) => {
    const { searchCity } = req.query;

    try {
      const messages = await Message.find({ city: searchCity}).sort({ createdAt: 'desc' });
      console.log(messages);
      const places = await Place.find().sort({ createdAt: 'asc' });
      res.render('discuss', { messages, places, user });
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });

// --------------------------------------------------------------------------------------------
// For Checking PNR Status------------------------------------------------------------------------
app.post('/submitkaro', (req, res) => {
  const pnr = req.body.pnr; // Extract PNR from the request body
  console.log('Received PNR:', pnr); 
  
  const options = {
    method: 'GET',
    hostname: 'irctc1.p.rapidapi.com',
    port: 443, // Use 443 for HTTPS 
    path: `/api/v3/getPNRStatus?pnrNumber=${pnr}`,
    headers: {
      'X-RapidAPI-Key': `${process.env.api}`,
      'X-RapidAPI-Host': 'irctc1.p.rapidapi.com'
    }
  };

  const req1 = https.request(options, function (apiResponse) {
    const chunks = [];
    
    apiResponse.on('data', function (chunk) {
      chunks.push(chunk);
    });
    
    // apiResponse.on('end', function () {
    //   const body = Buffer.concat(chunks);
    //   res.send(body.toString()); // Send the API response to the client
    // 

    apiResponse.on('end', function () {
      const body = Buffer.concat(chunks);
      const pnrStatus = JSON.parse(body.toString());
      res.render('pnr', { pnrStatus });
    });
  });
  req1.end();
        

});

// ------------------------------------------------------------------------------------------------------
var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server Has Started!");
});