var mongoose = require('mongoose');
var Product = require('../models/product.model');
var User = require('../models/user.model');

exports.create = function (req, res) {

    if (!req.headers['token']) {
        return res.json({status: 200, msg: 'Invalid request'})
    }
    var token = req.headers['token'];

    var user = new User();
    user.verifyToken(token, function (valid) {
        if (!valid) {
            return res.json({status: 203, msg: 'invalid tokens'});
        }
        else {
            req.body.user_id = valid._id;
            var new_product = new Product(req.body);
            new_product.save(function (err, product) {
                if (err) {
                    res.json({status: 300, msg: err})
                }
                else {
                    res.json({status: 200, msg: 'Product Added to DB successfully'})
                }
            });
        }
    });


}

exports.delete = function (req, res) {

    var product_id = req.params.product_id;

    if (!req.headers['token']) {
        return res.json({status: 500, msg: 'Invalid request'})
    }
    var token = req.headers['token'];

    var user = new User();
    user.verifyToken(token, function (valid) {
        if (!valid) {
            return res.json({status: 203, msg: 'invalid tokens'});
        }
        else {
            Product.update({'_id': product_id}, {$set: {is_deleted: true}}, function (err, product) {
                if (err) {
                    return res.json({status: 500, msg: 'error while deleting the product !'});
                }
                else {
                    res.json({status: 200, msg: 'Product deleted successfully !'});
                }
            })
        }
    });
}

exports.update = function (req, res) {
    var product_id = req.params.product_id;
    var product = req.body;

    if (!req.headers['token']) {
        return res.json({status: 500, msg: 'Invalid request'})
    }
    var token = req.headers['token'];

    var user = new User();
    user.verifyToken(token, function (valid) {
        if (!valid) {
            return res.json({status: 203, msg: 'invalid tokens'});
        }
        else {
            Product.update({'_id': product_id}, {$set: product}, function (err, updatedproduct) {
                if (err) {
                    return res.json({status: 500, msg: 'error while updating the product !'});
                }
                else {
                    res.json({status: 200, msg: 'Product updated successfully !'});
                }
            })
        }
    });
}

exports.getByUser = function (req, res) {
    if (!req.headers['token']) {
        return res.json({status: 200, msg: 'Invalid request'})
    }
    var token = req.headers['token'];
    var user = new User();
    user.verifyToken(token, function (valid) {
        if (!valid) {
            return res.json({status: 203, msg: 'invalid tokens'});
        }
        else {
            Product.find({user_id: valid._id, is_deleted: false}, function (err, products) {
                res.json({status: 200, msg: 'got product data ', data: products});
            })
        }
    });

}



