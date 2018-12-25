const express = require('express');
const hbs  = require('express-hbs');
const fs = require('fs');

var app = express();

let dataAPI;
let vendorData;
let vendorDataAPI;

let vendorDesc = {
    '863940356': 'Big fat fallen selling some planet mats.'
}

updateData();
updateVendorData();

fs.watchFile('storage/data.json', updateData)
fs.watchFile('storage/vendor.json', updateVendorData);

app.engine('hbs', hbs.express4({
    partialsDir: __dirname + '/views/partials',
    defaultLayout: __dirname + '/views/layouts/main',
    layoutsDir: __dirname + '/views/layouts'
  }));

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

app.get('/', (req, res) => {
    res.render('index', dataAPI);
})

app.get('/index', (req, res) => {
    res.render('index', dataAPI);
})

app.get('/guides', (req, res) => {
    res.render('guides', dataAPI);
})

app.get('/spider', (req, res) => {
    res.render('spider', dataAPI);
})

app.get('/data', (req, res) => {
    res.redirect('/data/quicklook');
})

app.get('/data/quicklook', (req, res) => {
    res.render('data/quicklook', dataAPI);
})

app.get('/data/vendor', (req, res) => {
    res.redirect('/data/vendor/863940356');
})

app.get('/data/vendor/:vendorhash', (req, res) => {
    if (req.params.vendorhash in vendorData) {
        res.render('data/vendor', vendorData[req.params.vendorhash]);
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
    res.send(dataAPI);
})

app.get('/api/vendor', (req, res) => {
    res.send(vendorDataAPI);
})

app.use(express.static('public'));

app.listen(80, () => {
    console.log('Server listening on port 80...');
})

function updateData() {
    data = JSON.parse(fs.readFileSync('storage/data.json', 'utf8'));
}

function updateVendorData() {
    let vendorFile = fs.readFileSync('storage/vendor.json', 'utf8');
    vendorDataAPI = JSON.parse(vendorFile);
    vendorData = JSON.parse(vendorFile);

    for (let vendorHash in vendorData) {
        let vendor = vendorData[vendorHash];
        vendor.desc = vendorDesc[vendorHash];
        vendor.otherVendors = [];
        for (let otherVendorHash in vendorData) {
            if (otherVendorHash != vendorHash) {
                let vendorDisplay = {
                    name: vendorData[otherVendorHash].display.name,
                    hash: otherVendorHash
                }
                vendor.otherVendors.push(vendorDisplay)
            }
        }
    }
}