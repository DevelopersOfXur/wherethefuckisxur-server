const express = require('express');
const hbs  = require('express-hbs');
const fs = require('fs');

var app = express();

hbs.registerHelper('noPurchase', (text, opts) => {
    let newText = text.replace(/purchase /ig, '');
    return newText
})

let data = {};
let vendorData;
let vendorDataAPI;
let cyclesAPI;
let xurAPI;
let msgData;

let vendorDesc = {
    '3982706173': '"I\'M REALLY AGGRESSIVE BUT ALSO NERDY AND HAVE A FUNNY VOICE BLAH BLAH VUVUZELA"', //Asher Mir
    '3603221665': 'You all know Shaxx is the real reason to play Crucible', //Lord Shaxx
    '3361454721': 'Fenchurch has been gone a real long time Tess, I think it\'s time to let them go', //Tess Everis
    '3347378076': 'Say hi to your clan mates for her', //Suraya Hawthorne
    '2917531897': 'Robo got ya weapon frames', //Ada-1
    '2398407866': 'I like to think he drops things all the time cuz he\'s wearing that blindfold', //Brother Vance
    '1735426333': 'GIVE ME THE 14 KELVINS YOU FUCK', //Ana Bray
    '1576276905': 'I\'m 99% sure no computer bug could cause a robot to go between depressed and optimistic', //Failsafe
    '1265988377': 'Just sweepin\' away', //Benedict 99-40
    '1062861569': 'Do you think she ever goes swimming in those giant oceans', //Sloane
    '997622907': '༼ つ ◕_◕ ༽つ ༼ つ ◕_◕ ༽つ gib silver ༼ つ ◕_◕ ༽つ ༼ つ ◕_◕ ༽つ', //Prismatic Matrix
    '919809084': 'it chrismas                    merr chrismas', //Eva Levante
    '863940356': 'Big fat fallen selling some planet mats.', //Spider
    '672118013': 'Who are you', //Banshee-44
    '396892126': 'I\'m a brit look at me pip pip cheerio', //Devrim Kay
    '248695599': 'Totally not a bad guy nothing to see here', //The Drifter
    '69482069': 'Whether we like or not, we\'ve stepped into a war on mars', //Commander Zavala
    '895295461': 'I can\'t decide if I like his voice or Shaxx\'s more', //Lord Saladin
    '2190858386': 'His will is not his own' //Xur
}

updateCycleData();
updateVendorData();
updateXurData();
updateMsgData();

console.log(data);

fs.watchFile('storage/cycles.json', updateCycleData);
fs.watchFile('storage/vendor.json', updateVendorData);
fs.watchFile('storage/xur.json', updateXurData);
fs.watchFile('storage/msg.json', updateMsgData);

app.engine('hbs', hbs.express4({
    partialsDir: __dirname + '/views/partials',
    defaultLayout: __dirname + '/views/layouts/main',
    layoutsDir: __dirname + '/views/layouts'
  }));

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

app.get('/', (req, res) => {
    res.render('home', data);
})

app.get('/index', (req, res) => {
    res.redirect('/');
})

app.get('/home', (req, res) => {
    res.redirect('/');
})

app.get('/data/', (req, res) => {
    res.redirect('/data/currentcycles');
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
    console.log(cyclesAPI.citystatus);
    res.render('guides/blindwell', cyclesAPI.citystatus);
})

app.get('/guides/ascendantchallenge', (req, res) => {
    res.render('guides/ascendantchallenge', cyclesAPI.ascendantchallenge);
})

app.get('/guides/dawning', (req, res) => {
    res.render('guides/dawning');
})

app.get('/guides/spider', (req, res) => {
    res.render('guides/spider');
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

app.get('/xur', (req, res) => {
    res.redirect('/api/xur');
})

app.get('/api/vendor', (req, res) => {
    res.send(vendorDataAPI);
})

app.get('/api/cycles', (req, res) => {
    res.send(cyclesAPI);
})

app.get('/api/xur', (req, res) => {
    res.send(xurAPI);
})

app.use(express.static('public'));

app.listen(80, () => {
    console.log('Server listening on port 80...');
})

function updateCycleData() {
    let cyclesFile = fs.readFileSync('storage/cycles.json', 'utf8');
    cyclesAPI = JSON.parse(cyclesFile);

    data.cycles = {
        activenightfalls: cyclesAPI.activenightfalls,
        dailies: cyclesAPI.dailies
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

    data.vendors = {
        banshee: vendorDataAPI['672118013'].categories[0],
        spider: vendorDataAPI['863940356'].categories[0],
        ada: vendorDataAPI['2917531897'].categories[0]
    }
    if ('2190858386' in vendorDataAPI) {
        data.vendors.xur = vendorDataAPI['2190858386'].categories[0];
    }
}

function updateXurData() {
    xurAPI = JSON.parse(fs.readFileSync('storage/xur.json', 'utf8'));

    if (xurAPI.present) {
        if (xurAPI.found) {
            data.xur = xurAPI.planet + ' > ' + xurAPI.zone + ' > ';
            switch (xurAPI.planet) {
                case 'Tower':
                    data.xur += 'Behind Dead Orbit';
                    break;
                case 'Titan':
                    data.xur += 'In a room';
                    break;
                case 'Io':
                    data.xur += 'In his cave';
                    break;
                case 'Nessus':
                    data.xur += 'In his tree';
                    break;
                case 'Earth':
                    data.xur += 'On his cliff';
                    break;
            }
        } else {
            data.xur = 'Xur\'s here, but we haven\'t found him yet';
        }
    } else {
        data.xur = 'Xur\'s fucked off';
    }
}

function updateMsgData() {
    let msgFile = fs.readFileSync('storage/msg.json', 'utf8');
    msgData = JSON.parse(msgFile);

    data.msg = msgData;
}