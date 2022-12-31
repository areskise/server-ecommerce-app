const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user')
const Product = require('../models/product')
const Order = require('../models/order')

exports.adminLogin = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json(errors.array()[0].msg);
    }

    const { email, password } = req.body;
    User.findOne({ email: email })
    .then(user => {
            console.log(user);
            if(user.role === 'admin') {
                if(bcrypt.compareSync(password, user.password)) {
                    const token = jwt.sign(
                        {user},
                        'secret',
                        { expiresIn: '1d' }
                    );
                    res.cookie('admin_token', token, {
                        maxAge: 86400000,
                    })
                    res.cookie('admin', user, {
                        maxAge: 86400000,
                    })
                    res.status(200).json(user);
                } else {
                    return res.status(401).json('Wrong password!');
                }
            } else if (user.role === 'counselor') {
                if(bcrypt.compareSync(password, user.password)) {
                    const token = jwt.sign(
                        {user},
                        'secret',
                        { expiresIn: '1d' }
                    );
                    res.cookie('admin_token', token, {
                        maxAge: 86400000,
                    })
                    res.cookie('counselor', user, {
                        maxAge: 86400000,
                    })
                    res.status(200).json(user);
                } else {
                    return res.status(401).json('Wrong password!');
                }
            } else {
                return res.status(401).json('Not authenticated!');
            }
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.adminLogout = (req, res, next) => {
    res.clearCookie('admin_token');
    res.clearCookie('admin');
    res.clearCookie('counselor');
    res.status(200).json('Logged out successfully')
}

exports.addProduct = (req, res, next) => {
    if(req.files.length !== 4) {
        return res.status(422).json('Attached file is not valid!');
    }
    const {name, category, stock, price, short_desc, long_desc} = req.body
    const images = req.files.map(file => file.location);
    const newProduct = new Product({
        name: name,
        category: category,
        price: price,
        short_desc: short_desc,
        long_desc: long_desc,
        img1: images[0],
        img2: images[1],
        img3: images[2],
        img4: images[3],
        stock: stock,
    })
    newProduct.save()
        .then(result => {
            console.log('Add New Product Successfully:', result);            
            res.status(201).json(`Add new product (${result.name}) successfully!`)
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

exports.updateProduct = (req, res, next) => {
    const {id, name, category, stock, price, short_desc, long_desc} = req.body
    let editProduct
    if(req.files.length === 4) {
        const images = req.files.map(file => file.location);
        editProduct = {
            name: name,
            category: category,
            price: price,
            short_desc: short_desc,
            long_desc: long_desc,
            img1: images[0],
            img2: images[1],
            img3: images[2],
            img4: images[3],
            stock: stock,
        }
    } else if(req.files.length === 0) {
        editProduct = {
            name: name,
            category: category,
            price: price,
            short_desc: short_desc,
            long_desc: long_desc,
            stock: stock,
        }
    } else {
        return res.status(422).json('Attached file is not valid!');
    }
    Product.findByIdAndUpdate(id, editProduct)
        .then(result => {
            console.log('Update Product Successfully:', result);            
            res.status(202).json(`Update product (${result.name}) successfully!`)
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

exports.deleteProduct = (req, res, next) => {
    const id = req.query.id;
    Order.find()
        .then(orders => {
            if(orders) {
                let productOrder = []
                orders.map(order => {
                    order.products.map(prod => {
                        const prodId = prod.product._id
                        productOrder.push(prodId.toString())
                    })
                });
                if (productOrder.includes(id)) {
                    return res.status(406).json('Cannot be deleted, this product is being ordered!');
                }
            }
            Product.findByIdAndDelete(id)
                .then(result => {
                    console.log('Delete Product Successfully:', result);            
                    res.status(202).json(`Delete product (${result.name}) successfully!`);
                })
                .catch(err => {
                    if (!err.statusCode) {
                        err.statusCode = 500;
                    }
                    next(err);
                });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}