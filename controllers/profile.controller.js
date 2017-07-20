'use strict'
var mongoose = require('mongoose')
var Profile = require('../models/profile.model');
var User = require('../models/user.model');


exports.createProfile = function (req, res) {
    var new_profile = new Profile(req.body);
    new_profile.save(function (err, user) {

        if (err) {
            return res.json({status: 205, msg: err});
        }
        else {
            res.json({status: 200, msg: 'profile created'})

        }

    })


}

exports.getProfile = function (req, res) {
    var token = req.body.token;
    var user = new User();
    user.verifyToken(token, function (valid) {

        if (!valid) {
            return res.json({status: 203, msg: 'invalid tokens'});
        }
        else {
            Profile.findOne({user_id: valid._id}, function (err, profile) {
                res.json({status: 200, msg: 'got profile data ', data: profile});
            })
        }
    });


}
