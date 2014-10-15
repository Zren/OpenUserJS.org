'use strict';

var toobusy = require('toobusy-js');
var express = require('express');
var MongoStore = require('connect-mongo')(express);
var mongoose = require('mongoose');
var passport = require('passport');

var app = express();

var statusCodePage = require('./libs/templateHelpers').statusCodePage;
var modifySessions = require('./libs/modifySessions');

var config = require('./config');

var db = mongoose.connection;
var dbOptions = { server: { socketOptions: { keepAlive: 1 } } };

app.set('port', process.env.PORT || 8080);

// Connect to the database
mongoose.connect(config.mongoose.uri, dbOptions);
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  app.listen(app.get('port'));
});

var sessionStore = new MongoStore({ mongoose_connection: db });

// See https://hacks.mozilla.org/2013/01/building-a-node-js-server-that-wont-melt-a-node-js-holiday-season-part-5/
app.use(function (aReq, aRes, aNext) {
  // check if we're toobusy
  if (toobusy()) {
    statusCodePage(aReq, aRes, aNext, {
      statusCode: 503,
      statusMessage: 'We\'re busy right now. Try again later.',
    });
  } else {
    aNext();
  }
});

// Force HTTPS
if (app.get('port') === 443) {
  app.use(function (aReq, aRes, aNext) {
    aRes.setHeader('Strict-Transport-Security',
      'max-age=8640000; includeSubDomains');

    if (aReq.headers['x-forwarded-proto'] !== 'https') {
      return aRes.redirect(301, 'https://' + aReq.headers.host + encodeURI(aReq.url));
    }

    aNext();
  });
}

if (process.env.NODE_ENV !== 'production') {
  app.use(require('morgan')('dev'));
}

app.use(express.urlencoded());
app.use(express.json());
app.use(express.compress());
app.use(express.methodOverride());

// Order is very important here (i.e mess with at your own risk)
app.use(express.cookieParser());
app.use(express.session({
  secret: config.express.sessionSecret,
  store: sessionStore
}));
app.use(passport.initialize());
app.use(modifySessions.init(sessionStore));
app.use(app.router);
app.use(express.favicon('public/images/favicon.ico'));

// Set up the views
app.engine('html', require('./libs/muExpress').renderFile(app));
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

// Routes
require('./routes')(app);
