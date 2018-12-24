const express = require('express');
const hbs  = require('express-hbs');
const fs = require('fs');

var app = express();

app.engine('hbs', hbs.express4({
    partialsDir: __dirname + '/views/partials',
    defaultLayout: __dirname + '/views/layouts/main',
    layoutsDir: __dirname + '/views/layouts'
  }));

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

app.get('/', (req, res) => {
    let data = JSON.parse(fs.readFileSync('storage/data.json', 'utf8'));
    res.render('index', data);
})

app.get('/index', (req, res) => {
    let data = JSON.parse(fs.readFileSync('storage/data.json', 'utf8'));
    res.render('index', data);
})

app.get('/guides', (req, res) => {
    let data = JSON.parse(fs.readFileSync('storage/data.json', 'utf8'));
    res.render('guides', data);
})

app.get('/spider', (req, res) => {
    let data = JSON.parse(fs.readFileSync('storage/data.json', 'utf8'));
    res.render('spider', data);
})

app.get('/data', (req, res) => {
    res.redirect('/data/quicklook');
})

app.get('/data/quicklook', (req, res) => {
    let data = JSON.parse(fs.readFileSync('storage/data.json', 'utf8'));
    res.render('data/quicklook', data);
})

app.get('/data/vendor', (req, res) => {
    res.redirect('/data/vendor/69482069');
})

app.get('/data/vendor/:vendorhash', (req, res) => {
    let vendor = JSON.parse(fs.readFileSync('storage/vendor.json', 'utf8'));
    if (req.params.vendorhash in vendor) {
        res.render('data/vendor', vendor[req.params.vendorhash]);
    } else {
        res.redirect('/data/vendor')
    }
})

app.get('/accessibility', (req, res) => {
    res.render('accessibility');
})

app.get('/archives', (req, res) => {
    res.render('archives');
})

app.get('/faq', (req, res) => {
    res.render('faq');
})

app.get('/privacy-policy', (req, res) => {
    res.render('privacy-policy');
})

app.get('/quiz-results', (req, res) => {
    res.render('quiz-results');
})

app.get('/api/data', (req, res) => {
    res.send(fs.readFileSync('storage/data.json', 'utf8'));
})

app.get('/api/vendor', (req, res) => {
    res.send(fs.readFileSync('storage/vendor.json', 'utf8'));
})

app.use(express.static('public'));

app.listen(80, () => {
    console.log('Server listening on port 80...');
})