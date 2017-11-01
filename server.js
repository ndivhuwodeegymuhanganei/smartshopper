//require the express app
var express = require('express');
//enables us to log any event that happens on the browser to the server
var morgan = require('morgan');
//for views to be able to render our info in html 
var ejs = require('ejs');
var engine = require('ejs-mate');
//to use data from form to json
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
//to store sessions
var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('express-flash');
var MongoStore = require('connect-mongo')(session);
var passport = require('passport');
var Category = require('./models/category');
var cartLength = require('./middlewares/middlewares');


var config = require('./config/secret');

//connection to the database
mongoose.connect(config.database, function(err) {
    if (err) {
        console.log('failed connecting to database');
    } else {
        console.log('database connection was established');
    }

});

//execute the application
var app = express();


//middleware
app.use(morgan('dev'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');
//teaching express to bootstrap css
app.use(express.static(__dirname + '/public'));
//pass form  data to json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//express session helps manage all the sessions info on the server saved to memory by default
//cookieis session info on encrypted session id  for the user on the client this helps manage request to the server with session info 
app.use(cookieParser());
app.use(session({
    resave: true,
    saveUnitialized: true,
    secret: config.secretKey,
    store: new MongoStore({ url: config.database, autoReconnect: true })
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
    res.locals.user = req.user;
    next();
})
app.use(cartLength);
app.use(function(req, res, next) {
    Category.find({}, function(err, categories) {
        if (err) return next(err);

        res.locals.categories = categories;
        next();
    });
});



//routes
var mainRoute = require('./routes/main');
var userRoute = require('./routes/user');
var adminRoute = require('./routes/admin');
var apiRoute = require('./api/api');

app.use(userRoute);
app.use(mainRoute);
app.use(adminRoute);
app.use('/api', apiRoute);
//kick off the application by using the listen function
app.listen(config.port, function() {
    console.log('app is now running on port 3000');
})