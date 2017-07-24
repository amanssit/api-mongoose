var mongoose = require('mongoose');
var Product = require('../models/product.model');
var User = require('../models/user.model');

exports.create = function (req, res) {

    var new_product = new Product(req.body);
    new_product.save(function (err, product) {
        if (err) {
            res.json({status: 300, msg: err})
        }
        else {
            res.json({ststus: 200, msg: 'Product Add to DB successfully'})
        }
    });


}

exports.getById = function (req, res) {



}

exports.getByUser = function (req, res) {
    var token = req.body.token;
    var user = new User();
    user.verifyToken(token, function (valid) {

        if (!valid) {
            return res.json({status: 203, msg: 'invalid tokens'});
        }
        else {
            Product.find({user_id: valid._id,is_deleted:false}, function (err, products) {
                res.json({status: 200, msg: 'got product data ', data: products});
            })
        }
    });

}



