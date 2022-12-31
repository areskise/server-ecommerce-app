const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();

const adminRoutes = require('./routes/admin');
const productRoutes = require('./routes/product');
const userRoutes = require('./routes/user');
const cartRoutes = require('./routes/cart');
const checkoutRoutes = require('./routes/checkout');
const historyRoutes = require('./routes/history');
const chatRoomRoutes = require('./routes/chatRoom');
const messengerRoutes = require('./routes/messenger');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin:true, credentials:true }));
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));

app.use(adminRoutes);
app.use(productRoutes);
app.use(userRoutes);
app.use(cartRoutes);
app.use(checkoutRoutes);
app.use(historyRoutes);
app.use(chatRoomRoutes);
app.use(messengerRoutes);

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  console.log(error);
  res.status(status).json('Error! An error occurred. Please try again later');
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    const server = app.listen(process.env.PORT || 5000);
    const io = require('./socket').init(server);
    io.on('connection', socket => {
      console.log('Connected socket: ' + socket.id);
    });
  })
  .catch(err => console.log(err));