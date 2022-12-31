const Product = require('../models/product')

exports.getAPI = (req, res, next) => {
    const search = req.query.search;
    const regex = new RegExp(search, 'i');
    
    Product.find({name: regex})
        .then(products => {
            res.status(200).json(products)
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.getCategory = (req, res, next) => {
    const {category, detailId} = req.query;
    Product.find({
        $and: [
            {category: category},
            {_id: { $ne: detailId }}
        ]
    })
        .limit(4)
        .then(products => {
            res.status(200).json(products)
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.getDetail = (req, res, next) => {
    const id = req.params.id
    Product.findById(id)
        .then(product => {
            res.status(200).json(product)
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.getPagination = (req, res, next) => {
    const {category, page, count, search} = req.query;
    const skip = (page - 1) * count;
    const regex = new RegExp(search, 'i');
    if(category === 'all') {
        Product.find(
            {name: regex}
        )
            .limit(count).skip(skip)
            .then(products => {
                res.status(200).json(products)
            })
            .catch(err => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
            })
    } else {
        Product.find({
            $and: [
                {category: category},
                {name: regex}
            ]
        })
            .limit(count).skip(skip)
            .then(products => {
                res.status(200).json(products)
            })
            .catch(err => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
            })
    }
}

exports.adminProduct = async (req, res, next) => {
    const {limit, page, search} = req.query;
    const skip = (page - 1) * limit;
    const regex = new RegExp(search, 'i');
    console.log(search);
    const count = await Product.find({name: regex})
        .then(products => {
            return products.length
    })
        Product.find({name: regex})
            .limit(limit).skip(skip)
            .then(products => {
                res.status(200).json({
                    products: products,
                    count: count
                })
            })
            .catch(err => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
            })
}