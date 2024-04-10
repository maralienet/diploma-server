const express = require('express');
const router = express.Router();

const { Routings } = require('../models');

router.get('/', async (req, res) => {
    let query = req.query;
    let RoutingsList = null;
    if (Object.keys(query).length === 0)
        RoutingsList = await Routings.findAll();
    else
        RoutingsList = await Routings.findAll({ where: query });
    res.json(RoutingsList);
});


router.post('/', async (req, res) => {
    const route = req.body;
    await Routings.create(route);
    res.json(user);
})

module.exports = router;
