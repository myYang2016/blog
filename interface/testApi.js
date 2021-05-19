const express = require('express');
const router = express.Router();
const { portResult } = require('../common/js/common');

router.get('/api/logger', (req, res) => {
  const data = req.query;
  console.log(data);
  res.json(portResult.success(''));
});

module.exports = router;