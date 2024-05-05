const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
    let query = req.query;
    let scedule;
    if (Object.keys(query).length === 0)
        scedule = await db.query('select * from scedule');
    else {
        let queryParams = [];
        let queryText = 'select * from scedule where ';
        let i = 1;
        for (let key in query) {
            queryText += `${key} = $${i} and `;
            queryParams.push(query[key]);
            i++;
        }
        queryText = queryText.slice(0, -5);
        scedule = await db.query(queryText, queryParams);
    }
    res.json(scedule.rows);
});

router.post('/', async (req, res) => {
    const { carId, isMulti, dateFrom, dateTo, timeFrom, timeTo } = req.body;
    let moment = require('moment');
    const createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
    const scedule = await db.query(`insert into scedule ("carId", "isMulti", "dateFrom", "dateTo", "timeFrom", "timeTo", "createdAt") 
    values (${carId},${isMulti},'${dateFrom}','${dateTo}','${timeFrom}','${timeTo}','${createdAt}')`);
    res.json(scedule.rows);
});

module.exports = router;
