const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
    const cities = await await db.query('select * from cities');
    res.json(cities.rows);
});

router.post('/', async (req, res) => {
    const { name, region, district, wikiDataId, latitude, longitude } = req.body;
    let moment = require('moment');
    const createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
    const city = await db.query(`insert into cities (name, region, district, "wikiDataId", latitude, longitude, "createdAt") 
    values ('${name}','${region}','${district}','${wikiDataId}',${latitude},${longitude},'${createdAt}')`);
    res.json(city.rows[0]);
})

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { region, district, latitude, longitude, } = req.body;
    const current = await db.query(`select * from cities where id=${id}`);
    const newRegion = region ? region : current.rows[0].region;
    const newDistrict = district ? district : current.rows[0].district;
    const newLatitude = latitude ? latitude : current.rows[0].latitude;
    const newLongitude = longitude ? longitude : current.rows[0].longitude;
    const city = await db.query(`update users set latitude = ${newLatitude}, longitude = ${newLongitude}, region='${newRegion}', district='${newDistrict}' where id=${id} RETURNING *`);
    return res.json(city.rows[0]);
});

module.exports = router;
