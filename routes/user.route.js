'use strict'

module.exports = function (app) {
    var userCtrl = require('../controllers/user.controller');

    app.route('/user')
        .get(userCtrl.show)
        .post(userCtrl.create);
    app.route('/user/auth')
        .post(userCtrl.login)

};


