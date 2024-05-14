const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

app.use(express.json());
app.use(cors());

//роутеры
const citiesRouter = require('./routes/Cities');
app.use('/cities', citiesRouter);
const carsRouter = require('./routes/Cars');
app.use('/cars', carsRouter);
const usersRouter = require('./routes/Users');
app.use('/users', usersRouter);
const routingsRouter = require('./routes/Routings');
app.use('/routings', routingsRouter);
const routingsScedule = require('./routes/Scedule');
app.use('/scedule', routingsScedule);

const PdfRouter = require('./routes/Pdf');
app.use('/pdf', PdfRouter);

app.listen(3001, () => {
    console.log('server started on 3001');
});