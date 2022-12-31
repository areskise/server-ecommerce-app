const Product = require('../models/product');

exports.getCarts = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .then(user => {
            res.status(200).json(user.cart.items);
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.postAddToCart = (req, res, next) => {
    const {productId, quantity } = req.query;
    Product.findById(productId)
        .then(product => {
            return req.user.addToCart(product, +quantity);
        })
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.deleteToCart = (req, res, next) => {
    const productId = req.query.productId;
    req.user
        .removeFromCart(productId)
        .then(result => {
            res.send(result);
        })
        .catch(err => console.log(err));
}

exports.putToCart = (req, res, next) => {
    const {productId, quantity } = req.query;
    Product.findById(productId)
        .then(product => {
            return req.user.putToCart(product, +quantity);
        })
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}