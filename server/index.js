const express = require('express');
const cors = require('cors');
require('dotenv').config();

const listingsRouter = require('./routes/listings');
const validateRouter = require('./routes/validate');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Apartment Listings API is running' });
});

app.use('/api/listings', listingsRouter);
app.use('/api/validate', validateRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
