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

router.get('/active', async (req, res) => {
    let scedule = await db.query(`
    select scedule.id, routings."routeId",cars.id as "carId", concat(brand,' (',"gosNumber",')') as car,"isMulti","dateFrom","dateTo","timeFrom","timeTo",routings.route,scedule."createdAt" from scedule
    join cars on cars.id=scedule."carId"
    join routings on routings.id=scedule."routeId"
    where "dateFrom"=date(now()) and
    "timeFrom"<=cast(now() as time) and "timeTo">=cast(now() as time)
    union
    select scedule.id, routings."routeId",cars.id as "carId",  concat(brand,' (',"gosNumber",')') as car,"isMulti","dateFrom","dateTo","timeFrom","timeTo",routings.route,scedule."createdAt" from scedule
    join cars on cars.id=scedule."carId"
    join routings on routings.id=scedule."routeId"
    where "dateTo">=date(now())
    order by id`);
    res.json(scedule.rows);
});

router.get('/completed', async (req, res) => {
    let scedule = await db.query(`
    select scedule.id, routings."routeId",cars.id as "carId", concat(brand,' (',"gosNumber",')') as car,"isMulti","dateFrom","dateTo","timeFrom","timeTo",routings.route,scedule."createdAt" from scedule
    join cars on cars.id=scedule."carId"
    join routings on routings.id=scedule."routeId"
    where ("dateFrom"<date(now()) and "dateTo" is null)
    or ("dateFrom"<date(now()) and "dateTo"<date(now()) and "dateTo" is not null)
    or ("dateFrom"=date(now()) and "timeTo"<=cast(now() as time))
    or ("dateTo"=date(now()) and "timeTo"<=cast(now() as time))
    order by id;`);
    res.json(scedule.rows);
});

router.get('/planned', async (req, res) => {
    let scedule = await db.query(`
    select scedule.id, routings."routeId",cars.id as "carId", concat(brand,' (',"gosNumber",')') as car,"isMulti","dateFrom","dateTo","timeFrom","timeTo",routings.route,scedule."createdAt" from scedule
    join cars on cars.id=scedule."carId"
    join routings on routings.id=scedule."routeId"
    where ("dateFrom">date(now()) and "dateTo" is null)
    or ("dateFrom">date(now()) and "dateTo">date(now()) and "dateTo" is not null)
    or ("dateFrom"=date(now()) and "timeFrom">=cast(now() as time))
    order by id;`);
    res.json(scedule.rows);
});

router.post('/', async (req, res) => {
    const { carId, isMulti, dateFrom, dateTo, timeFrom, timeTo, routeId } = req.body;
    let moment = require('moment');
    const createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
    let scedule;
    if (dateTo)
        scedule = await db.query(`insert into scedule ("carId", "isMulti", "dateFrom", "dateTo", "timeFrom", "timeTo", "createdAt", "routeId") 
    values (${carId},${isMulti},'${dateFrom}','${dateTo}','${timeFrom}','${timeTo}','${createdAt}',${routeId})`);
    else
        scedule = await db.query(`insert into scedule ("carId", "isMulti", "dateFrom", "dateTo", "timeFrom", "timeTo", "createdAt", "routeId") 
    values (${carId},${isMulti},'${dateFrom}',${dateTo},'${timeFrom}','${timeTo}','${createdAt}',${routeId})`);
    res.json(scedule.rows);
});

module.exports = router;