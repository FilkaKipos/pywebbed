const express = require('express');
const router = express.Router();
const Test = require('../models/Test');
const User = require('../models/User');

router.get('/testik', (req, res) => {
  res.render('testik');
});


module.exports = router;
