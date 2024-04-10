const express = require('express');
const Sequelize = require('sequelize');
const router = express.Router();

const { Users } = require('../models');

router.get("/", async (req, res) => {
    let query = req.query;
    let listOfUsers;

    if (Object.keys(query).length === 0)
        listOfUsers = await Users.findAll({});
    else
        listOfUsers = await Users.findAll({
            where: query
        });
    res.json(listOfUsers);
});


router.get("/maxid", async (req, res) => {
    const userWithMaxId = await Users.findOne({ order: [['id', 'DESC']] });
    res.json(userWithMaxId);
});

router.post("/", async (req, res) => {
    const user = req.body;
    const createdUser = await Users.create(user);
    res.json(createdUser);
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, surname, role } = req.body;
    const item = await Users.findByPk(id);

    const updatedItem = await item.update({ name, surname, role });
    return res.json(updatedItem);
});


module.exports = router;