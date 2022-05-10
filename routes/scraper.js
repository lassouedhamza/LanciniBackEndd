const express = require('express');
const router = express.Router();
const fs = require('fs');
const banks_offers = JSON.parse(fs.readFileSync('./data/banks_offers.json'));


/* GET home page. */
router.get('/', function(req, res, next) {
    try {
  res.json(banks_offers);
} catch (error) {
    res.status(404).json({ message: error.message });
}

});

module.exports = router;
