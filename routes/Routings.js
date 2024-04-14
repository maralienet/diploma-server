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

router.get("/bycar", async (req, res) => {
    const [result, metadata] = await Routings.sequelize.query(`
    select carId,count(*) as routesCount,sum(length) as totalLength 
    from routings
    group by carId;
    `);
    res.json(result);
});

router.get("/bycar/:id", async (req, res) => {
    const { id } = req.params;
    const [result, metadata] = await Routings.sequelize.query(`
    select carId,count(*) as routesCount,sum(length) as totalLength 
    from routings
    where carId=${id}
    group by carId;
    `);
    res.json(result);
});

router.get("/byroute", async (req, res) => {
    const [result, metadata] = await Routings.sequelize.query(`
    select routeId,group_concat(carId) as cars,route,length
    from routings
    group by routeId,route,length;
    `);
    res.json(result);
});

router.post('/', async (req, res) => {
    const route = req.body;
    await Routings.create(route);
    res.json(route);
})

module.exports = router;
