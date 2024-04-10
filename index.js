const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());

const db = require('./models');

//роутеры
const citiesRouter = require('./routes/Cities');
app.use('/cities', citiesRouter);
const carsRouter = require('./routes/Cars');
app.use('/cars', carsRouter);
const usersRouter = require('./routes/Users');
app.use('/users', usersRouter);
const routingsRouter = require('./routes/Routings');
app.use('/routings', routingsRouter);

db.sequelize.sync().then(() => {
    app.listen(3001, () => {
        console.log('server started on 3001');
    });
});