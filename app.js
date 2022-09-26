var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
require('./common/library/dbMaster')
const {errorResponse} = require('./common/helper/responseHelper')

var index = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//Global declarations responses
_RESP = require('./common/helper/responseHelper')


app.use('/api/v1', index);


// error handler
app.use(function(err, req, res, next) {
 return errorResponse(res,err.statusCode, err.message);
});

module.exports = app;
