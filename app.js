var express = require('express'),
	errorhandler = require('errorhandler'),
	bodyParser = require('body-parser'),
	session = require('express-session'),
	serveStatic = require('serve-static'),
	multer = require('multer'),
	morgan = require('morgan'),
	app = express(),
	http = require('http').Server(app),
	io = require('socket.io')(http);

app.set('env', 'development'); // move to external file
app.set('port', 9090); // move to external file
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer());
app.use(serveStatic('public/', {
	index: 'index.html'
}));

/* Development only */
if ('development' === app.get('env')) {
	app.use(errorhandler());
}

require('./game-routes')(io);

http.listen(app.get('port'), function () {
	console.log('Listening on port', app.get('port'));
});





// var app = require('express')();
// var bodyParser = require('body-parser');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');
// var serveStatic = require('serve-static');

// var http = require('http').Server(app);
// var io = require('socket.io')(http);

// app.use(logger('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(serveStatic('dist/', {
// 	index: 'index.html'
// }));

// require('./game-routes')(io);


// http.listen(8080, function () {
// 	console.log('Listening on 8080');
// });
