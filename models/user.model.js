var mongoose = require('mongoose');
var crypto = require('crypto');
var secret = require('../config/secret');
var jwt = require('jsonwebtoken');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: 'username is required'
    },
    password: {
        type: String,
        required: 'Password is required'
    },
    salt: {
        type: String
    },
    created_date: {
        type: Date,
        Default: Date.now
    },
    is_deleted:{
        type:Boolean,
        default:false
    }


});

UserSchema.pre('save', function (next) {
    var user = this;
    // generate a random salt for every user for security
    user.salt = crypto.randomBytes(16).toString('hex');
    user.password = crypto.pbkdf2Sync(user.password, this.salt, 1000, 64).toString('hex');
    next();
})


UserSchema.methods.generateJwt = function () {
    console.log('check this : ', this);
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    return jwt.sign({
        _id: this._id,
        username: this.username,
        exp: parseInt(expiry.getTime() / 1000),
    }, secret.secret); // DO NOT KEEP YOUR SECRET IN THE CODE!
};

UserSchema.methods.verifyToken = function (token, cb) {

    jwt.verify(token, secret.secret, function (err, dcode) {
        if (err) {
            cb(false);
        }
        else {
            cb(dcode);
        }

    })
}


module.exports = mongoose.model('User', UserSchema);