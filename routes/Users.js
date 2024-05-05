const express = require('express');
const router = express.Router();
const db = require('../db');

router.get("/", async (req, res) => {
    let query = req.query;
    let users;
    if (Object.keys(query).length === 0)
        users = await db.query('select * from users');
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
    const { name, surname, role } = req.body;
    const currentUser = await db.query(`select * from users where id=${id}`);
    const newName = name ? name : currentUser.rows[0].name;
    const newSurname = surname ? surname : currentUser.rows[0].surname;
    const newRole = role ? role : currentUser.rows[0].role;
    const user = await db.query(`update users set name = '${newName}', surname='${newSurname}', role=${newRole} where id=${id} RETURNING *`);
    return res.json(user.rows);
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const user = await db.query(`update users set available='false' where id=${id}`);
    return res.json(user.rows);
});

module.exports = router;