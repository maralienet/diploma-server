const express = require('express');
const router = express.Router();

const { Cities } = require('../models');

router.get('/', async (req, res) => {
    const CitiesList = await Cities.findAll();
    res.json(CitiesList);
});

router.post('/', async (req, res) => {
    const city = req.body;
    await Cities.create(city);
    res.json('ok');
})

module.exports = router;