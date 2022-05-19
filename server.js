//___________________
//Dependencies
//___________________
const express = require('express');
const methodOverride  = require('method-override');
const mongoose = require ('mongoose');
const app = express ();
const db = mongoose.connection;
require('dotenv').config()

const Data = require('./models/anischema.js')
const seed = require('./models/animal.js')
//___________________
//Port
//___________________
// Allow use of Heroku's port or your own local port, depending on the environment
const PORT = process.env.PORT

//___________________
//Database
//___________________
// How to connect to the database either via heroku or locally
const MONGODB_URI = process.env.MONGODB_URI;

// Connect to Mongo &
// Fix Depreciation Warnings from Mongoose
// May or may not need these depending on your Mongoose version
mongoose.connect(MONGODB_URI, () => {
    console.log('connected  to mongo')
});

// Error / success
db.on('error', (err) => console.log(err.message + ' is Mongod not running?'));
db.on('connected', () => console.log('mongo connected: ', MONGODB_URI));
db.on('disconnected', () => console.log('mongo disconnected'));

//___________________
//Middleware
//___________________

//use public folder for static assets
app.use(express.static('public'));

// populates req.body with parsed info from forms - if no data from forms will return an empty object {}
app.use(express.urlencoded({ extended: false }));// extended: false - does not allow nested objects in query strings
app.use(express.json());// returns middleware that only parses JSON - may or may not need it depending on your project

//use method override
app.use(methodOverride('_method'));// allow POST, PUT and DELETE from a form

//seed data
app.get('/animals/seed', (req, res) => {
  Data.create(seed, (err, createData) => {
      console.log('seed data registered!')
  })
  res.redirect('/animals')
})

//___________________
// Routes
//EDIT => GET
app.get('/animals/:id/edit', (req, res) => {
    Data.findById(req.params.id, (err, mammalMan) => {
        res.render('edit.ejs', {
            data : mammalMan
        });
    });
});

//INDEX
app.get('/animals', (req, res) => {
  Data.find({}, (error, aminals) => {
    res.render('index.ejs',{
      data: aminals
    })
  })
})

//NEW
app.get('/animals/new', (req, res) => {
    res.render('new.ejs');
})

//SHOW
 app.get('/animals/:id', (req, res) => {
 Data.findById(req.params.id, (error, character) => {
     res.render('show.ejs',
     {list: character})
   })
 })

 //POST
 app.post('/animals', (req, res) => {
   Data.create(req.body, (error, createdAnimal) => {
     res.redirect('/animals')
   })
 })

// UPDATE => PUT
app.put('/animals/:id', (req, res)=>{
    Data.findByIdAndUpdate(req.params.id, req.body, {new:true}, (err, updatedModel)=>{
          // console.log(req.body)
          // res.send(updatedModel);
        res.redirect('/animals');
      });
  });


  // DESTROY => DELETE
  app.delete('/animals/:id', (req, res) => {
      Data.findByIdAndRemove(req.params.id, (err, data)=> {
          res.redirect('/Animals');
      });
  });

//___________________
//localhost:3000
// app.get('/' , (req, res) => {
//   res.send('Hello World!');
// });

//___________________
//Listener
//___________________
app.listen(PORT, () => console.log('Listening on port:', PORT));
