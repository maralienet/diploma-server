const express = require('express');
const router = express.Router();
const db = require('../db');

router.get("/", async (req, res) => {
    let query = req.query;
    let users;
    if (Object.keys(query).length === 0)
        users = await db.query('select * from users order by id');
    else {
        let queryParams = [];
        let queryText = 'select * from users where ';
        let i = 1;
        for (let key in query) {
            queryText += `${key} = $${i} and `;
            queryParams.push(query[key]);
            i++;
        }
        queryText = queryText.slice(0, -5);
        users = await db.query(queryText, queryParams);
    }
    res.json(users.rows);
});

router.get("/maxid", async (req, res) => {
    const userWithMaxId = await db.query(`
    select * from users 
    where id=(select max(id) from users) 
	order by id desc limit 1
    `);
    res.json(userWithMaxId.rows);
});

router.get("/stats", async (req, res) => {
    const userWithMaxId = await db.query(`
    select routings."userId", name, surname, count(*), max(active_day) as "maxActive"
    from users
    join (
    select "userId", "routeId", count(*) as count, to_char("createdAt", 'YYYY-MM-DD') as active_day
    from routings
    group by "userId", "routeId", active_day
    order by count desc
    ) as routings on routings."userId" = users.id
    where role=2
    group by routings."userId", name, surname;
    `);
    res.json(userWithMaxId.rows);
});

router.post("/", async (req, res) => {
    const { name, surname, login, password, role } = req.body;
    let moment = require('moment');
    const createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
    const createdUser = await db.query(`insert into users (name, surname, login, password, role, "createdAt") 
    values ('${name}','${surname}','${login}','${password}',${role},'${createdAt}')`);
    res.json(createdUser.rows);
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, surname, password, role } = req.body;
    const currentUser = await db.query(`select * from users where id=${id}`);
    const newName = name ? name : currentUser.rows[0].name;
    const newSurname = surname ? surname : currentUser.rows[0].surname;
    const newRole = role ? role : currentUser.rows[0].role;
    const newPass = password ? password : currentUser.rows[0].password;
    const user = await db.query(`update users set name = '${newName}', surname='${newSurname}', password='${newPass}', role=${newRole} where id=${id} RETURNING *`);
    return res.json(user.rows);
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const user = await db.query(`update users set active='false' where id=${id}`);
    return res.json(user.rows);
});

module.exports = router;