const express = require('express');
const router = express.Router();
const { validateAddress } = require('../utils/validateAddress');

// POST /api/validate
router.post('/', (req, res) => {
  const { address } = req.body;
  if (!address) return res.status(400).json({ error: 'address is required' });
  const result = validateAddress(address);
  res.json(result);
});

module.exports = router;
