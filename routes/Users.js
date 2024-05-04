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
    res.json(userWithMaxId);
});

router.post("/", async (req, res) => {
    const { name, surname, login, password, role } = req.body;
    const createdAt = new Date().toJSON();
    const createdUser = await db.query(`insert into users values ()`);
    res.json(createdUser);
});

// router.put('/:id', async (req, res) => {
//     const { id } = req.params;
//     const { name, surname, role } = req.body;
//     const item = await Users.findByPk(id);

//     const updatedItem = await item.update({ name, surname, role });
//     return res.json(updatedItem);
// });


module.exports = router;