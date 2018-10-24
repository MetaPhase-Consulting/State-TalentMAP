const saml2 = require('saml2-js');
const express = require('express');
const bodyParser = require('body-parser');

const PORT = 5000;

const app = express();

app.use(bodyParser.urlencoded({
  extended: true,
}));

app.post('/login', (res, req, next) => {

});

app.get('/logout', (res, req, next) => {
  
});

app.listen(PORT);
