var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var LinkedInStrategy = require('passport-linkedin').Strategy;
var User = require('../models/user.model');
var session = require('express-session')

module.exports = function (app, passport) {

    app.use(passport.initialize());
    app.use(passport.session());
    app.use(session({secret: 'keyboard cat', resave: false, saveUninitialized: true, cookie: {secure: false}}));

    passport.serializeUser(function (user, done) {

        token = "ghsgdfhghghghghghghghghghghghg";

        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use(new FacebookStrategy({
            clientID: '',
            clientSecret: '',
            callbackURL: "http://localhost:3000/auth/facebook/callback",
            profileFields: ['id', 'displayName', 'photos', 'email']
        },
        function (accessToken, refreshToken, profile, done) {
            console.log(profile._json);
            User.findOne({username: profile._json.email}, function (err, user) {

                console.log(user);
                if (err) {
                    done(err);
                }
                else if (user && user != null) {
                    done(null, user);//this will go to serializeUser up
                }
                else {
                    done(err);
                }

            });

        }
    ));


    passport.use(new TwitterStrategy({
            consumerKey: '',
            consumerSecret: '',
            callbackURL: "http://localhost:3000/auth/twitter/callback",
            userProfileURL: 'https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true'

        },
        function (token, tokenSecret, profile, done) {
            console.log(profile.emails[0].value);
            User.findOne({username: profile.emails[0].value}, function (err, user) {

                console.log(user);
                if (err) {
                    done(err);
                }
                else if (user && user != null) {
                    done(null, user);//this will go to serializeUser up
                }
                else {
                    done(err);
                }

            });
        }
    ));


    passport.use(new LinkedInStrategy({
            consumerKey: '',
            consumerSecret: '',
            callbackURL: "http://localhost:3000/auth/linkedin/callback",
            profileFields: ['id', 'first-name', 'last-name', 'email-address', 'headline']
        },
        function (token, tokenSecret, profile, done) {

            console.log(profile._json);
            User.findOne({username:profile._json.emailAddress}, function (err, user) {

                console.log(user);
                if (err) {
                    done(err);
                }
                else if (user && user != null) {
                    done(null, user);//this will go to serializeUser up
                }
                else {
                    done(err);
                }

            });

        }
    ));


    app.get('/auth/linkedin', passport.authenticate('linkedin', {scope: ['r_basicprofile', 'r_emailaddress']}));

    app.get('/auth/linkedin/callback', passport.authenticate('linkedin', {failureRedirect: '/login'}), function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('http://localhost:4200/social/' + token);
    });


    app.get('/auth/twitter', passport.authenticate('twitter'));

    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', {failureRedirect: 'http://localhost:4200/login'}), function (req, res) {
            res.redirect('http://localhost:4200/social/' + token);
        });


    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {failureRedirect: 'http://localhost:4200/login'}), function (req, res) {

            res.redirect('http://localhost:4200/social/' + token);

        });

    app.get('/auth/facebook',
        passport.authenticate('facebook', {scope: 'email'})
    );


    return passport;
}