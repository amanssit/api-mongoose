'use strict'
var mongoose = require('mongoose');
var crypto = require('crypto');
var User = mongoose.model('User');

exports.create = function (req, res) {
    var user = req.body;
    var new_user = new User(user);
    new_user.save(function (err, result) {
        if (err) {
            res.send(err);
        }
        else {
            res.json({status: 200, msg: 'User created'});
        }
    });

}
exports.show = function (req, res) {
    User.find(function (err, rows) {
        if (err) {
            res.json(err);
        }
        else {
            res.json({status: 200, msg: rows})
        }
    });
}


exports.login = function (req, res) {
    var userData = req.body;
    User.findOne({'username': userData.username}, function (err, user) {
        console.log(user)
        if (err) {
            return res.json(err);
        }
        if (!user) {
            return res.json({status: 404, msg: 'Invalid Username try aging !'});
        }
        if (user) {
            var password = crypto.pbkdf2Sync(userData.password, user.salt, 1000, 64).toString('hex');

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