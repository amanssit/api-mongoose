var express = require('express');
var port = process.env.PORT || 3000;
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var cors=require('cors');
var passport = require('passport');
var User = require('./models/user.model');
var dbConfig = require('./config/db');
var app = express();

var social=require('./passport/passport')(app,passport);

app.use(cors());

app.use(cookieParser());

mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.db, function (err) {
    if (err) {
        console.log('faild to connect with mongo DB', err);
    }
    else {
        console.log('Connection open with mongo db');
    }
})

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.cookie('token' , 'this is cookies test').send('Welcome to server api');
});

var userRoute = require('./routes/user.route')(app);
var profileRoute = require('./routes/profile.route')(app);
var productRoute=require('./routes/products.route')(app);


app.listen(port, function (err) {
    if (err) {
        console.log(err);
    }
    else {
        console.log('Server api runing on port ', port);
    }
})
