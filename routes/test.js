const express = require('express');
const router = express.Router();
const Test = require('../models/Test');
const User = require('../models/User');

function isAuthenticated(req, res, next) {
  if (req.session.userId) {
    return next();
  } else {
    res.redirect('/auth/login');
  }
}

router.get('/testik', isAuthenticated, (req, res) => {
  const role = req.session.role;

  if (role === 'student') {
    res.render('testik');
  } else if (role === 'teacher') {
    res.render('teacher_dashboard');
  } else {
    res.redirect('/auth/login');
  }
});

module.exports = router;
