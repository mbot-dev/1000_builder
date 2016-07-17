'use strict';

const express = require('express');

var router = express.Router();

router.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

module.exports = router;
