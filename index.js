const express = require('express');
const app = express();

const db = require('./models');

//роутеры
const citiesRouter = require('./routes/Cities');
app.use('/cities', citiesRouter);

db.sequelize.sync().then(() => {
    app.listen(3001, () => {
        console.log('server started on 3001');
    });
});