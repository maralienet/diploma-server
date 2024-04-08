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

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { latitude,longitude,district } = req.body;
    const item = await Cities.findByPk(id);

    const updatedItem = await item.update({ latitude,longitude,district });
    return res.json(updatedItem);
})

module.exports = router;
