const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

var app = express();

hbs.registerPartials(__dirname + '/views/partials');
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});
hbs.registerHelper('screamIt', text => {
  return text.toUpperCase();
});

app.set('view engine', 'hbs');

// Using express middleware to log request to a new file 'server.log'
app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;
  console.log(log);
  fs.appendFile('server.log', log + '\n', err => {
    if (err) {
      console.log('Unable to append to server.log');
    }
  });
  next();
});

// Using express middleware to set up a maintenance page if the app is under maintenance.
// app.use((req, res, next) => {
//   res.render('maintenance.hbs', {
//     message: 'Hi! Page is under maintenance, sorry :('
//   });
// });

app.use(express.static(__dirname + '/public'));

// Set up routes
app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    welcomeMsg: 'welcome to home page!'
  });
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About Page'
  });
});

app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'Unable to fulfill request'
  });
});

// Telling the app to listen to port 3000 & log out a message on success
app.listen(3000, () => {
  console.log('Server is up on port 3000');
});
