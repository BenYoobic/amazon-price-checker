// Server Dependencies
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Models Imports
const User = require('./api/models/userModel');
const SingleItem = require('./api/models/singleItemModel');
const Items = require('./api/models/itemsModel');

// Init Express
const app = express();

// DB Connection
mongoose.Promise = global.Promise;
mongoose.connect(
  /**
   * TODO: CHANGE THE DB LOCATION LOCALLY TO YOUR DB NAME OF CHOICE
   * OR IN .env CONNECT DB TO REMOTE ADDRESS
   */
  'mongodb://localhost:27017/amazon_products_db',
  {
    useNewUrlParser: true,
    useCreateIndex: true
  },
  e => {
    if (e) {
      const dbError = {
        error: e,
        msg: 'Error Connecting to Database. Please check MongoDB is running'
      };
      console.log(dbError);
    } else {
      console.log('Connected to Database');
    }
  }
);

// Server Config
require('dotenv').config();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Cors Controls
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'POST, GET, PATCH, DELETE, OPTIONS'
  );
  next();
});
app.use(cors());

// Routes Definitions
const userRoutes = require('./api/routes/userRoutes');
const authRoutes = require('./api/routes/authRoutes');
const scraperRoutes = require('./api/routes/scraperRoutes');
userRoutes(app);
authRoutes(app);
scraperRoutes(app);

// 404 Handling
app.use((req, res) => {
  res.status(404).send({ url: req.originalUrl + ' not found' });
});

// Server Port Controls
const port = process.env.PORT || '3000';
app.set('port', port);
const server = http.createServer(app);
server.listen(port, () => console.log(`API running on localhost:${port}`));
