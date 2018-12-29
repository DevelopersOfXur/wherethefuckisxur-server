const express = require('express');
const hbs  = require('express-hbs');
const fs = require('fs');

var app = express();

let dataAPI;
let vendorData;
let vendorDataAPI;
let cyclesAPI;

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

app.get('/data/currentcycles', (req, res) => {
    res.render('data/currentcycles', cyclesAPI);
})

app.get('/guides/', (req, res) => {
    res.render('guides/welcome');
})

app.get('/guides/escalationprotocol', (req, res) => {
    res.render('guides/escalationprotocol', cyclesAPI.escalationprotocol);
})

app.get('/guides/blindwell', (req, res) => {
    res.render('guides/blindwell', cyclesAPI.citystatus);
})

app.get('/guides/ascendantchallenge', (req, res) => {
    res.render('guides/ascendantchallenge', cyclesAPI.ascendantchallenge);
})

app.get('/guides/dawning', (req, res) => {
    res.render('guides/dawning');
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
    dataAPI = JSON.parse(fs.readFileSync('storage/data.json', 'utf8'));

    console.log(dataAPI);

    cyclesAPI = {};
    cyclesAPI.ascendantchallenge = dataAPI.ac;
    cyclesAPI.escalationprotocol = dataAPI.ep;
    cyclesAPI.citystatus = dataAPI.bw;
    cyclesAPI.dailies = dataAPI.dailies;
    cyclesAPI.nightfalls = dataAPI.activenightfalls;
    switch (cyclesAPI.citystatus.id) {
        case 1:
            cyclesAPI.citystatus.curse = 'None'
            break
        case 2:
            cyclesAPI.citystatus.curse = 'Partial'
            break
        case 3:
            cyclesAPI.citystatus.curse = 'Full'
            break
    }
}

function updateVendorData() {
    let vendorFile = fs.readFileSync('storage/vendor.json', 'utf8');
    vendorDataAPI = JSON.parse(vendorFile);
    vendorData = JSON.parse(vendorFile);

    for (let vendorHash in vendorData) {
        let vendor = vendorData[vendorHash];
        let desc;
        if (vendorHash in vendorDesc) {
            desc = vendorDesc[vendorHash];
        } else {
            desc = 'This guy so new we don\'t even have a description yet';
        }
        vendor.desc = desc;
        vendor.vendors = [];
        for (let otherVendorHash in vendorData) {
            let vendorDisplay = {
                name: vendorData[otherVendorHash].display.name,
                hash: otherVendorHash
            }
            vendor.vendors.push(vendorDisplay)
        }
    }
}