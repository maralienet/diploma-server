const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
    let query = req.query;
    let cars;
    if (Object.keys(query).length === 0)
        cars = await await db.query('select * from cars order by id');
    else {
        let queryParams = [];
        let queryText = 'select * from cars where ';
        let i = 1;
        for (let key in query) {
            queryText += `${key} = $${i} and `;
            queryParams.push(query[key]);
            i++;
        }
        queryText = queryText.slice(0, -5);
        cars = await db.query(queryText, queryParams);
    }
    res.json(cars.rows);
});

router.post('/', async (req, res) => {
    const { gosNumber, brand, capacity } = req.body;
    let moment = require('moment');
    const createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
    const car = await db.query(`insert into cars ("gosNumber", brand, capacity, "createdAt") 
    values ('${gosNumber}','${brand}',${capacity},'${createdAt}')`);
    res.json(car.rows);
})

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { gosNumber, brand, capacity } = req.body;
    const currentCar = await db.query(`select * from cars where id=${id}`);
    const newGosNumber = gosNumber ? gosNumber : currentCar.rows[0].gosNumber;
    const newBrand = brand ? brand : currentCar.rows[0].brand;
    const newCapacity = capacity ? capacity : currentCar.rows[0].capacity;
    const car = await db.query(`update cars set "gosNumber"='${newGosNumber}', brand='${newBrand}', capacity=${newCapacity}`);
    res.json(car.rows);
})

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const car = await db.query(`update cars set active='false' where id=${id}`);
    return res.json(car.rows);
});

module.exports = router;