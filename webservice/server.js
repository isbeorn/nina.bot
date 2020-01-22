const express = require('express');
const helmet = require('helmet');

const app = express();

app.use(helmet());

app.get('/', function(req, res, next) {
    res.send('Hello');
});

const port = process.env.PORT || 5000;

app.listen(port, function() {
    console.log(`Listening on port ${port}`);
});