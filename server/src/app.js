const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const authRouter = require('./routes/authRouter');
const tokenRouter = require('./routes/tokenRouter');
const userRouter = require('./routes/userRouter');
const searchRouter = require('./routes/searchRouter');
const photoRouter = require('./routes/photoRouter');

const app = express();

app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/tokens', tokenRouter);
app.use('/api/users', userRouter);
app.use('/api/search', searchRouter);
app.use('/api/photos', photoRouter);

module.exports = app;
