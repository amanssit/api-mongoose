'use strict'

module.exports = function (app) {

    var profileCtrl = require('../controllers/profile.controller');

    app.route('/profile')
        .post(profileCtrl.createProfile);

    app.route('/profile/me')
        .post(profileCtrl.getProfile);


}