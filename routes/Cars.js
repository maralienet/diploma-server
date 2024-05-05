const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
    const cars = await await db.query('select * from cars');
    res.json(cars.rows);
});

router.post('/', async (req, res) => {
    const { gosNumber, brand, capacity } = req.body;
    let moment = require('moment');
    const createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
    const car = await db.query(`insert into cars ("gosNumber", brand, capacity, "createdAt") 
    values ('${gosNumber}','${brand}',${capacity},'${createdAt}')`);
    res.json(car.rows[0]);
})

module.exports = router;
