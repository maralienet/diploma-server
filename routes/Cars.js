const express = require('express');
const router = express.Router();

const { Cars } = require('../models');

router.get('/', async (req, res) => {
    const CarsList = await Cars.findAll();
    res.json(CarsList);
});

router.post('/', async (req, res) => {
    const car = req.body;
    await Cars.create(car);
    res.json(user);
})

module.exports = router;
