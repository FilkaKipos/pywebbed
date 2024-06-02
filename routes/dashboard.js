// routes/dashboard.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Test = require('../models/Test');



// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
  if (req.session.userId) {
    return next();
  } else {
    res.redirect('/auth/login');
  }
}

router.get('/', isAuthenticated, (req, res) => {
  const role = req.session.role;

  if (role === 'student') {
    res.render('lesson1');
  } else if (role === 'teacher') {
    res.render('teacher_dashboard');
  } else {
    res.redirect('/auth/login');
  }
});

router.post('/submit-test', async (req, res) => {
  try {
    const { module, score } = req.body;
    const userId = req.session.userId;

    if (!userId) {
      return res.status(400).send('User is not logged in');
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send('User not found');
    }

    const test = new Test({ module, score, user: userId });
    await test.save();

    user.results.push(test._id);
    await user.save();

    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while submitting the test');
  }
});

// routes/dashboard.js

router.get('/results', isAuthenticated, async (req, res) => {
  try {
    // Проверяем роль пользователя
    if (req.session.role !== 'teacher') {
      return res.status(403).send('Forbidden');
    }

    // Находим все результаты тестов в базе данных
    const results = await Test.find().populate('user', 'username');

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while fetching results');
  }
});


module.exports = router;

