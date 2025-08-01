require('dotenv').config();

const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');
const userRoutes = require('./routes/user')
const eventsRoutes = require('./routes/events')
const paymentsroutes = require('./routes/payments_route')

const app = express();
const port = 5000;

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL');
  }
});

app.use(bodyParser.json());
const corsOptions = {
  origin: 'http://localhost:3000', // Your frontend origin
  credentials: true, // Allow credentials (cookies, auth headers)
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

app.use(cookieParser());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});
app.use(cors(corsOptions));
app.use('/api/user', userRoutes)
app.use('/api/events', eventsRoutes)
app.use('/api/payments', paymentsroutes)

app.listen(port, () => {
  console.log(`Server is running on the port ${port}`);
});
