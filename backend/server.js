const express = require('express');
const cors = require('cors');
const connectDB = require('./database-connect');
const routes = require('./routes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});