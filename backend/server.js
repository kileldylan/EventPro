require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userController = require('./controllers/userController');
const db = require('./db');

const app = express();
const port = 4000;

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL');
  }
});

app.use(bodyParser.json());
app.use(cors());

app.post('/api/login', userController.login);

app.post('/api/signup', userController.signup);

app.get('/api/check-email', userController.checkEmail);

app.get('/api/check-username', userController.checkUsername);

app.get('/api/getUser/:username', userController.getUserDetails);

app.listen(port, () => {
  console.log(`Server is running on the port ${port}`);
});
