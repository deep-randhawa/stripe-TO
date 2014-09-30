/**
 * Module Dependencies
 */
var express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    favicon = require('serve-favicon'),
    cookieParser = require('cookie-parser');


/**
 * Controllers
 */
var mainController = require('./controllers/main');

/**
 * Express
 */
var app = express();


/**
 * Stack
 */
app.enable('trust proxy');
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(require('connect-assets')({
  src: 'public',
  helperContext: app.locals
}));
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(morgan('dev'));
app.use(cookieParser('youShallNotPassWord'));
app.use(bodyParser());
app.use(methodOverride());
app.use(function(req, res, next) {
  // Middleware
  next();
});
app.use(express.static(__dirname + '/public'));

/**
 * Routers
 */
var mainRouter = express.Router();

/**
 * Main Router
 */
mainRouter.get("/", mainController.getHome);
mainRouter.post("/charge", mainController.chargeUser);

app.use("/", mainRouter);

app.listen(app.get('port'), function() {
  console.log("Express server listening on port %d in %s mode", app.get('port'), app.settings.env);
});