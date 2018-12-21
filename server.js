const express = require('express');
const exphbs  = require('express-handlebars');
const fs = require('fs');

var app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
    let data = JSON.parse(fs.readFileSync('storage/data.json').toJSON());
    res.render('index', data);
})

app.get('/index', (req, res) => {
    let data = JSON.parse(fs.readFileSync('storage/data.json').toJSON());
    res.render('index', data);
})

app.get('/guides', (req, res) => {
    let data = JSON.parse(fs.readFileSync('storage/data.json').toJSON());
    res.render('guides', data);
})

app.get('/spider', (req, res) => {
    let data = JSON.parse(fs.readFileSync('storage/data.json').toJSON());
    res.render('spider', data);
})

app.get('/data/vendor', (req, res) => {
    res.redirect('/data/vendor/69482069');
})

app.get('/data/vendor/:vendorhash', (req, res) => {
    let vendor = JSON.parse(fs.readFileSync('storage/vendor.json'));
    if (req.params.vendorhash in vendor) {
        res.render('vendor', vendor[req.params.vendorhash]);
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
    res.send(fs.readFileSync('storage/data.json'));
})

app.get('/api/vendor', (req, res) => {
    res.send(fs.readFileSync('storage/vendor.json'));
})

app.use(express.static('public'));

app.listen(80, () => {
    console.log('Server listening on port 80...');
})