'use strict'
var mongoose = require('mongoose');
var crypto = require('crypto');
var User = mongoose.model('User');

var Profile=require('../models/profile.model');

exports.create = function (req, res) {
    var user={};
    var profile={};

    user.username = req.body.username;
    user.password = req.body.password;

    profile.name=req.body.name;
    profile.city=req.body.city;

    var new_user = new User(user);
    new_user.save(function (err, result) {
        if (err) {
            res.send(err);
        }
        else {
            profile.user_id=result._id;
            var new_profile=new Profile(profile);
            new_profile.save(function (err,profile) {
                if(err)
                {
                    res.send(err);
                }
                else
                {
                    res.json({status: 200, msg: 'User created',data:profile});
                }
            })

        }
    });

}
exports.show = function (req, res) {
    User.find(function (err, rows) {
        if (err) {
            res.json(err);
        }
        else {
            res.json({status: 200, msg: 'got user data',data:rows})
        }
    });
}


exports.login = function (req, res) {
    var userData = req.body;
    User.findOne({'username': userData.username,'is_deleted':false}, function (err, user) {
        if (err) {
            return res.json(err);
        }
        if (!user) {
            return res.json({status: 404, msg: 'Invalid Username try again !'});
        }
        if (user) {
            var password = crypto.pbkdf2Sync(userData.password, user.salt, 1000, 64,'sha512').toString('hex');

            User.findOne({'username': userData.username, 'password': password}, function (err, userlogin) {
                if (err) {
                    return res.json(err);
                }
                if (!userlogin) {
                    return res.json({status: 404, msg: "wrong password try again ! "});
                }
                if (userlogin) {
                    res.json({status: 200, msg: "Login success", token: userlogin.generateJwt()});
                }
            })
        }
    });
}