const express = require('express');
const bodyParser = require('body-parser');
const bunyan = require('bunyan');
const helmet = require('helmet');
const path = require('path');
const url = require('url');
const https = require('https');
const pem = require('pem');
const routesArray = require('./routes.js');
const { metadata, login, loginAlt } = require('./saml2-config');

// middleware to override helmet.noCache
const removeCacheControl = (req, res, next) => {
  res.set({
    'Cache-Control': 'public',
  });
  res.removeHeader('Surrogate-Control');
  res.removeHeader('Pragma');
  res.removeHeader('Expires');
  next();
};

// middleware to force cache control
const forceCacheControl = (req, res, next) => {
  res.set({
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    Pragma: 'no-cache',
    Expires: 0,
  });
  next();
};

// define full path to static build
const STATIC_PATH = process.env.STATIC_PATH || path.join(__dirname, '../build');

// define the prefix for the application
const PUBLIC_URL = process.env.PUBLIC_URL || '/talentmap/';

// Define the SAML login redirect
const SAML_LOGIN = process.env.SAML_LOGIN_URL;

// Define the SAML logout redirect
const SAML_LOGOUT = process.env.SAML_LOGOUT_URL;

// Routes from React, with wildcard added to the end if the route is not exact
const ROUTES = routesArray.map(route => `${PUBLIC_URL}${route.path}${route.exact ? '' : '*'}`.replace('//', '/'));

// path to external about page
const ABOUT_PAGE = process.env.ABOUT_PAGE || 'https://github.com/18F/State-TalentMAP';

// application port
const port = process.env.PORT || 3000;

// set up logger
const logger = bunyan.createLogger({ name: 'TalentMAP' });

// logging middleware
const loggingMiddleware = (request, response, next) => {
  // object to log
  const log = {
    method: request.method,
    headers: request.headers,
    url: request.url,
    query: request.query,
  };

  response.on('error', () => {
    logger.error(log);
  });

  response.on('finish', () => {
    logger.info(log);
  });

  next();
};

const app = express();

// body parser
app.use(bodyParser.urlencoded({ extended: false }));

// remove 'X-Powered-By' header
app.disable('x-powered-by');

// middleware for HTTP headers
app.use(helmet());
app.use(helmet.noCache());

// cache certain extensions (images and fonts)
app.use(PUBLIC_URL, (req, res, next) => {
  const urlObj = url.parse(req.originalUrl);
  const cacheMatches = urlObj.pathname.match(/\.(jpe?g|png|gif|svg|woff2|ico)$/i);
  const noCacheMatches = urlObj.pathname.match(/\.(js|css)$/i);
  if (cacheMatches) {
    removeCacheControl(req, res, next);
  } else if (noCacheMatches) {
    forceCacheControl(req, res, next);
  } else {
    next();
  }
});

// middleware for static assets
app.use(PUBLIC_URL, express.static(STATIC_PATH));

app.use(bodyParser.urlencoded({
  extended: true,
}));

// middleware for logging
app.use(loggingMiddleware);

// saml2 acs
app.post(PUBLIC_URL, (request, response) => {
  response.redirect(307, SAML_LOGIN);
});

// saml2 login
app.get(`${PUBLIC_URL}login`, (request, response) => {
  const { adfs } = request.query;
  // eslint-disable-next-line no-unused-vars
  const loginHandler = (err, loginUrl, requestId) => {
    if (err) {
      response.sendStatus(500);
    } else {
      response.redirect(loginUrl);
    }
  };
  return !adfs ? loginAlt(loginHandler) : login(loginHandler);
});

// saml2 metadata
app.get(`${PUBLIC_URL}metadata`, (request, response) => {
  response.type('application/xml');
  response.send(metadata);
});

app.get(`${PUBLIC_URL}logout`, (request, response) => {
  response.redirect(SAML_LOGOUT);
});

app.get(`${PUBLIC_URL}about/more`, (request, response) => {
  response.redirect(`${ABOUT_PAGE}`);
});

app.get(ROUTES, (request, response) => {
  response.sendFile(path.resolve(STATIC_PATH, 'index.html'));
});

// This is our wildcard, 404 route.
// It will redirect to an internal React Route with an error message.
app.get('*', (request, response) => {
  response.status(404).sendFile(path.resolve(STATIC_PATH, 'index.html'));
});

const server = app.listen(port);

// for local https testing
if (process.env.HTTPS_PORT) {
  pem.createCertificate({ days: 1, selfSigned: true }, (err, keys) => {
    https.createServer({ key: keys.serviceKey, cert: keys.certificate }, app)
      .listen(process.env.HTTPS_PORT);
  });
}

// export the the app and server separately
module.exports = { app, server, removeCacheControl };
