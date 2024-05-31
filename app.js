const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const { exec } = require('child_process');
const app = express();
const PORT = process.env.PORT || 3003;

const lessonRoutes = require('./routes/lesson1');
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard'); 

app.use('/', lessonRoutes);

app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/pywebbed')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
}));
// Подключение маршрута с тестами
const testRoutes = require('./routes/test');

// Использование маршрутов
app.use('/testik', testRoutes); // Используем маршруты для тестов по адресу "/test"


app.post('/run', (req, res) => {
  const code = req.body.code;

  exec(`python3 -c "${code.replace(/"/g, '\\"')}"`, (error, stdout, stderr) => {
    if (error) {
      res.json({ output: stderr });
    } else {
      res.json({ output: stdout });
    }
  });
});
  
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Убедитесь, что путь указан правильно

app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);

app.get('/', (req, res) => {
  res.render('index');
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});