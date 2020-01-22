const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const app = express();

app.use(helmet());
app.use(bodyParser.json())

app.post('/crowdin/to/discord', function(req, res, next) {
    console.log(req.body);
    res.send('Ok');
});

const port = process.env.PORT || 5000;

app.listen(port, function() {
    console.log(`Listening on port ${port}`);
});