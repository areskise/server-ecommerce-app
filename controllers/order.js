const Order = require('../models/order');
const Product = require('../models/product');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: `${process.env.MAIL_USER}`,
      pass: `${process.env.MAIL_PASS}`,
    },
  });

exports.postOrder = (req, res, next) => {
    const {fullName, email, phone, address, total} = req.query;
    req.user
        .populate('cart.items.productId')
        .then(user => {
            const products = user.cart.items.map(i => {
                const newStock = i.productId.stock - i.quantity
                Product.findByIdAndUpdate(i.productId._id, {stock: newStock},
                    function (err, product) {
                        if (err){
                            console.log(err)
                        }
                        else{
                            console.log("Updated product : ", product.name);
                        }
            })
                return { quantity: i.quantity, product: { ...i.productId._doc } };
            });
            const order = new Order({
                user:{ 
                    userId: req.user,
                    fullName: fullName,
                    email: email,
                    phone: phone,
                    address: address, 
                },
                products: products,
                total: total
            });
            return order.save();
        })
        .then(result => {
            
            const msg = {
                to: email,
                from: 'hieuthfx15451@funix.edu.vn',
                subject: 'Hóa Đơn Đặt Hàng Của Bạn',
                text: 'and easy to do anywhere, even with Node.js',
                html: `
                    <h1>Xin Chào ${fullName}!</h1><br/
                    <p>Số điện thoại: ${phone}</p>
                    <p>Địa chỉ: ${address}</p>
                    <table>
                    <thead>
                        <tr>
                        <th style="border: 1px solid black">Tên sản phẩm</th>
                        <th style="border: 1px solid black">Hình ảnh</th>
                        <th style="border: 1px solid black">Đơn giá</th>
                        <th style="border: 1px solid black">Số lượng</th>
                        <th style="border: 1px solid black">Thành tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${result.products.map(prod => {
                        return `
                            <tr>
                            <td style="border: 1px solid black">${prod.product.name}</td>
                            <td style="border: 1px solid black"><img src="${prod.product.img1}" width="80" height="80" /></td>
                            <td style="border: 1px solid black">${prod.product.price} VNĐ</td>
                            <td style="border: 1px solid black">${prod.quantity} </td>
                            <td style="border: 1px solid black">${prod.quantity * prod.product.price} VNĐ</td>
                            </tr>
                        `
                        })}
                    </tbody>
                    </table>
                    <p>Ngày đặt hàng: ${result.created_at.toLocaleDateString('en-GB')}</p>
                    <h2>Thành tiền: ${new Intl.NumberFormat('vn-VN', {style: 'currency', currency: 'VND'}).format(result.total)}</h2>
                    `,
            }

            transporter
                .sendMail(msg)
                .then(() => {
                    console.log('Email sent success')
                })
                .catch((err) => {
                    console.error('Email sent fail', err)
                })
            req.user.clearCart();
            res.status(201).json('Order success');
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.getHistoryAPI = (req, res, next) => {
    Order.find({ 'user.userId': req.user._id })
        .sort({'created_at': -1})
        .then(orders => {
            res.status(200).json(orders);
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.getAdminHistory = async (req, res, next) => {
    const limit = req.query.limit;
    const page = req.query.page ? req.query.page : 1
    const skip = (page - 1) * limit

    const count = await Order.find().then(orders => {
        return orders.length
    })

    Order.find()
        .limit(limit).sort({'created_at': -1}).skip(skip)
        .then(orders => {
            console.log(orders);
            res.status(200).json({
                orders: orders,
                count: count
            });
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
    Order.findById(id)
        .then(order => {
            res.status(200).json(order);
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}