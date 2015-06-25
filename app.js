var app = require('express')();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var serveStatic = require('serve-static');

var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(serveStatic('dist/', {
	index: 'index.html'
}));

require('./game-routes')(io);


http.listen(8080, function () {
	console.log('Listening on 8080');
});
