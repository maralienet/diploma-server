const express = require('express');
const router = express.Router();
const db = require('../db');
const puppeteer = require('puppeteer');

function formatDate(date) {
    let moment = require('moment');
    return moment(date).format('DD.MM.YYYY');
}

router.get('/cars/period/:from/:to', async (req, res) => {
    let { from, to } = req.params;
    let result = await db.query(`
    select concat(brand,' (',"gosNumber",')') as Машина, count(*) as "Проехано маршрутов", sum(length) as "Всего км", string_agg(cast("routeId" as text), '<br/>') as "Маршруты"
    from routings
    join cars on cars.id=routings."carId"
    where routings."createdAt" >= '${from}' and routings."createdAt" < '${to}'::date + interval '1 day'
    group by "carId", brand, "gosNumber"`);
    let data = result.rows;

    if (!data[0]) {
        res.status(404).json({ error: 'Данных за этот период нет' });
        return;
    }
    let headers = Object.keys(data[0]);
    let body = [];
    body.push(headers);

    data.forEach(item => {
        let row = [];
        headers.forEach(header => {
            row.push(item[header]);
        })
        body.push(row);
    });

    let today = formatDate(new Date());
    let html = `
    <html>
    <head>
    <style>
        body {
            font-family: muller, Arial, sans-serif;
            margin: 2.5% 10% 0;
        }
        h1,
        h2,
        h3,
        h4,
        h5,
        h5 {
            font-weight: normal;
        }
        .header {
            display: grid;
            grid-template-columns: 200px 1fr 200px;
            text-align: center;
        }
        .header h2 {
            margin-bottom: 10px;
        }
        .header h3 {
            margin-top: 0;
        }
        .data {
            display: flex;
            justify-content: flex-start;
            align-items: center;
        }
        .logo {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            img{
                width: 90px;
                height: 90px;        
            }
        }
        .body {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
        table {
            border-collapse: collapse;
            width: 100%;
        }
        table * {
            border: 1px solid;
        }
        tr:first-child {
            padding: 10px 0;
            font-weight: bold;
            text-align: center;
        }
        td:nth-child(2),td:nth-child(3){
            text-align: center;
        }
        td {
            padding: 5px 10px;
        }
        .footer {
            margin-top: 50px;
            display: flex;
            flex-direction: column;
            width: 100%;
        }
        .footer>div {
            margin: 10px 0;
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
        }
        .fio {
            text-align: end;
        }
        .signature {
            color: #a0a0a0;
            font-size: 0.7em;
            border-bottom: 1px solid black;
            text-align: center !important;
        }
      
      .body h3:nth-child(1){
        margin-bottom:0;
        padding-bottom:0;
      }
      .body h3:nth-child(2){
        font-size:1em;
      }
    </style>
    </head>
    <body>
        <div class="header">
            <div class="data">${today}</div>
            <div>
                <h2>Логистика товаров народного подтребления</h2>
            </div>
            <div class="logo"><img src="http://localhost:3000/static/media/logo.18919efbba90b2796491.png" /></div>
        </div>
        <div class="body">
            <h3>Отчёт по маршрутам грузовиков</h3>
            <h3>За период: с ${from} по ${to}</h3>
            <table>
                ${body.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}
            </table>
        </div>
        <div class="footer">
            <div>
                <div>Логист</div>
                <div class="signature">(Подпись)</div>
                <div class="fio">Ф.Ф. Фёдоров</div>
            </div>
            <div>
                <div>Директор</div>
                <div class="signature">(Подпись)</div>
                <div class="fio">И.И. Иванов</div>
            </div>
        </div>
    </body>
    </html>
    `;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html);
    await page.pdf({ path: 'out.pdf', format: 'A4' });
    await browser.close();
    res.download('out.pdf');
});
router.get('/cars/month', async (req, res) => {
    let result = await db.query(`
    select concat(brand,' (',"gosNumber",')') as "Машина", count(*) as "Проехано маршрутов", sum(length) as "Всего км", string_agg(cast("routeId" as text), '<br/>') as "Маршруты"
    from routings
    join cars on cars.id=routings."carId"
    where extract(month from routings."createdAt") = extract(month from current_date)
    group by "carId", brand, "gosNumber"`);
    let data = result.rows;
    if (!data[0]) {
        res.status(404).json({ error: 'Данных за этот период нет' });
        return;
    }

    let headers = Object.keys(data[0]);
    let body = [];
    body.push(headers);

    data.forEach(item => {
        let row = [];
        headers.forEach(header => {
            row.push(item[header]);
        })
        body.push(row);
    });
    const monthName = new Date().toLocaleString('ru', { month: 'long' });
    const today = formatDate(new Date());
    let html = `
    <html>
    <head>
    <style>
        body {
            font-family: muller, Arial, sans-serif;
            margin: 2.5% 10% 0;
        }
        h1,
        h2,
        h3,
        h4,
        h5,
        h5 {
            font-weight: normal;
        }
        .header {
            display: grid;
            grid-template-columns: 200px 1fr 200px;
            text-align: center;
        }
        .header h2 {
            margin-bottom: 10px;
        }
        .header h3 {
            margin-top: 0;
        }
        .data {
            display: flex;
            justify-content: flex-start;
            align-items: center;
        }
        .logo {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            img{
                width: 90px;
                height: 90px;        
            }
        }
        .body {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
        table {
            border-collapse: collapse;
            width: 100%;
        }
        table * {
            border: 1px solid;
        }
        tr:first-child {
            padding: 10px 0;
            font-weight: bold;
            text-align: center;
        }
        td:nth-child(2),td:nth-child(3){
            text-align: center;
        }
        td {
            padding: 5px 10px;
        }
        .footer {
            margin-top: 50px;
            display: flex;
            flex-direction: column;
            width: 100%;
        }
        .footer>div {
            margin: 10px 0;
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
        }
        .fio {
            text-align: end;
        }
        .signature {
            color: #a0a0a0;
            font-size: 0.7em;
            border-bottom: 1px solid black;
            text-align: center !important;
        }
      
      .body h3:nth-child(1){
        margin-bottom:0;
        padding-bottom:0;
      }
      .body h3:nth-child(2){
        font-size:1em;
      }
    </style>
    </head>
    <body>
        <div class="header">
            <div class="data">${today}</div>
            <div>
                <h2>Логистика товаров народного подтребления</h2>
            </div>
            <div class="logo"><img src="http://localhost:3000/static/media/logo.18919efbba90b2796491.png" /></div>
        </div>
        <div class="body">
            <h3>Отчёт по маршрутам грузовиков</h3>
            <h3>За ${monthName}</h3>
            <table>
                ${body.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}
            </table>
        </div>
        <div class="footer">
            <div>
                <div>Логист</div>
                <div class="signature">(Подпись)</div>
                <div class="fio">Ф.Ф. Фёдоров</div>
            </div>
            <div>
                <div>Директор</div>
                <div class="signature">(Подпись)</div>
                <div class="fio">И.И. Иванов</div>
            </div>
        </div>
    </body>
    </html>
    `;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html);
    await page.pdf({ path: 'out.pdf', format: 'A4' });
    await browser.close();
    res.download('out.pdf');
});


router.get('/routes/period/:from/:to', async (req, res) => {
    let { from, to } = req.params;
    let result = await db.query(`
    select to_char(date(routings."createdAt"),'DD.MM.YYYY') as "Дата", "routeId" as "Код", string_agg(concat(brand,' (',"gosNumber",')'), '<br/>') as "Грузовики", route as "Путь", length as "Протяжённость"
    from routings
    join cars on cars.id=routings."carId"
    where routings."createdAt" >= '${from}' and routings."createdAt" < '${to}'::date + interval '1 day'
    group by "routeId", route, length, date(routings."createdAt")`);
    let data = result.rows;
    if (!data[0]) {
        res.status(404).json({ error: 'Данных за этот период нет' });
        return;
    }
    let headers = Object.keys(data[0]);
    let body = [];
    body.push(headers);

    data.forEach(item => {
        let row = [];
        headers.forEach(header => {
            row.push(item[header]);
        })
        body.push(row);
    });

    let today = formatDate(new Date());
    let html = `
    <html>
    <head>
    <style>
        body {
            font-family: muller, Arial, sans-serif;
            margin: 2.5% 10% 0;
        }
        h1,
        h2,
        h3,
        h4,
        h5,
        h5 {
            font-weight: normal;
        }
        .header {
            display: grid;
            grid-template-columns: 200px 1fr 200px;
            text-align: center;
        }
        .header h2 {
            margin-bottom: 10px;
        }
        .header h3 {
            margin-top: 0;
        }
        .data {
            display: flex;
            justify-content: flex-start;
            align-items: center;
        }
        .logo {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            img{
                width: 90px;
                height: 90px;        
            }
        }
        .body {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
        table {
            border-collapse: collapse;
            width: 100%;
        }
        table * {
            border: 1px solid;
        }
        tr:first-child {
            padding: 10px 0;
            font-weight: bold;
            text-align: center;
        }
        td:nth-child(1),td:nth-child(2),td:nth-child(5){
            text-align: center;
        }
        td {
            padding: 5px 10px;
        }
        .footer {
            margin-top: 50px;
            display: flex;
            flex-direction: column;
            width: 100%;
        }
        .footer>div {
            margin: 10px 0;
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
        }
        .fio {
            text-align: end;
        }
        .signature {
            color: #a0a0a0;
            font-size: 0.7em;
            border-bottom: 1px solid black;
            text-align: center !important;
        }
      
      .body h3:nth-child(1){
        margin-bottom:0;
        padding-bottom:0;
      }
      .body h3:nth-child(2){
        font-size:1em;
      }
    </style>
    </head>
    <body>
        <div class="header">
            <div class="data">${today}</div>
            <div>
                <h2>Логистика товаров народного подтребления</h2>
            </div>
            <div class="logo"><img src="http://localhost:3000/static/media/logo.18919efbba90b2796491.png" /></div>
        </div>
        <div class="body">
            <h3>Отчёт по маршрутам</h3>
            <h3>За период: с ${from} по ${to}</h3>
            <table>
                ${body.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}
            </table>
        </div>
        <div class="footer">
            <div>
                <div>Логист</div>
                <div class="signature">(Подпись)</div>
                <div class="fio">Ф.Ф. Фёдоров</div>
            </div>
            <div>
                <div>Директор</div>
                <div class="signature">(Подпись)</div>
                <div class="fio">И.И. Иванов</div>
            </div>
        </div>
    </body>
    </html>
    `;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html);
    await page.pdf({ path: 'out.pdf', format: 'A4' });
    await browser.close();
    res.download('out.pdf');
});
router.get('/routes/month', async (req, res) => {
    let result = await db.query(`
    select to_char(date(routings."createdAt"), 'DD.MM.YYYY') as "Дата", 
    "routeId" as "Код", 
    string_agg(concat(brand,' (',"gosNumber",')'), '<br/>') as "Грузовики", 
    route as "Путь", 
    length as "Протяжённость"
    from routings
    join cars on cars.id = routings."carId"
    where extract(month from routings."createdAt") = extract(month from current_date)
    group by "routeId", route, length, routings."createdAt";`);
    let data = result.rows;
    if (!data[0]) {
        res.status(404).json({ error: 'Данных за этот период нет' });
        return;
    }
    let headers = Object.keys(data[0]);
    let body = [];
    body.push(headers);

    data.forEach(item => {
        let row = [];
        headers.forEach(header => {
            row.push(item[header]);
        })
        body.push(row);
    });
    const monthName = new Date().toLocaleString('ru', { month: 'long' });
    const today = formatDate(new Date());
    let html = `
    <html>
    <head>
    <style>
        body {
            font-family: muller, Arial, sans-serif;
            margin: 2.5% 10% 0;
        }
        h1,
        h2,
        h3,
        h4,
        h5,
        h5 {
            font-weight: normal;
        }
        .header {
            display: grid;
            grid-template-columns: 200px 1fr 200px;
            text-align: center;
        }
        .header h2 {
            margin-bottom: 10px;
        }
        .header h3 {
            margin-top: 0;
        }
        .data {
            display: flex;
            justify-content: flex-start;
            align-items: center;
        }
        .logo {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            img{
                width: 90px;
                height: 90px;        
            }
        }
        .body {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
        table {
            border-collapse: collapse;
            width: 100%;
        }
        table * {
            border: 1px solid;
        }
        tr:first-child {
            padding: 10px 0;
            font-weight: bold;
            text-align: center;
        }
        td:nth-child(1),td:nth-child(2),td:nth-child(5){
            text-align: center;
        }
        td {
            padding: 5px 10px;
        }
        .footer {
            margin-top: 50px;
            display: flex;
            flex-direction: column;
            width: 100%;
        }
        .footer>div {
            margin: 10px 0;
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
        }
        .fio {
            text-align: end;
        }
        .signature {
            color: #a0a0a0;
            font-size: 0.7em;
            border-bottom: 1px solid black;
            text-align: center !important;
        }
      
      .body h3:nth-child(1){
        margin-bottom:0;
        padding-bottom:0;
      }
      .body h3:nth-child(2){
        font-size:1em;
      }
    </style>
    </head>
    <body>
        <div class="header">
            <div class="data">${today}</div>
            <div>
                <h2>Логистика товаров народного подтребления</h2>
            </div>
            <div class="logo"><img src="http://localhost:3000/static/media/logo.18919efbba90b2796491.png" /></div>
        </div>
        <div class="body">
            <h3>Отчёт по маршрутам грузовиков</h3>
            <h3>За ${monthName}</h3>
            <table>
                ${body.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}
            </table>
        </div>
        <div class="footer">
            <div>
                <div>Логист</div>
                <div class="signature">(Подпись)</div>
                <div class="fio">Ф.Ф. Фёдоров</div>
            </div>
            <div>
                <div>Директор</div>
                <div class="signature">(Подпись)</div>
                <div class="fio">И.И. Иванов</div>
            </div>
        </div>
    </body>
    </html>
    `;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html);
    await page.pdf({ path: 'out.pdf', format: 'A4' });
    await browser.close();
    res.download('out.pdf');
});

module.exports = router;