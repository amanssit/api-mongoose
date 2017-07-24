'use strict'

module.exports = function (app) {
    var product = require('../controllers/product.controller');

    app.route('/product')
        .post(product.create)


    app.route('/product/list')
        .post(product.getByUser)

    app.route('/product/:product_id')
        .get(product.getById)
        .delete(product.delete)

}