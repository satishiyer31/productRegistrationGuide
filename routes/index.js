const express = require('express');

const prodRegRouter = require('./prodreg');

const app = express();

app.use('/prodreg',prodRegRouter);

module.exports = app;