const express = require('express');
const hbs = require('express-hbs');
const fs = require('fs');

var app = express();

var dataDir = 'storage';

// Command line arguments.
for (let i = 0; i < process.argv.length; i++) {
    if (process.argv[i] == '--data') {
        dataDir = process.argv[i + 1];
        ++i;
        if (!fs.existsSync(dataDir)) {
            throw 'Invalid data location.';
        }
    }
}

hbs.registerHelper('filter', (text, opts) => {
    let reg = new RegExp(opts, 'ig');
    let newText = text.replace(reg, '');
    return newText
})

hbs.registerHelper('noCaps', (text, opts) => {
    let newText = text;
    if (text) {
        newText = text.toLowerCase();
    } else {
        console.log('ERROR: No text provided to the noCaps helper!');
    }
    return newText;
})

let data = {};
let layout = {};
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
    '2190858386': 'His will is not his own', //Xur
    '1841717884': '(Currently Petra Venj\'s vendor inventory is broken due to a Bungie API bug, not much we can do here sorry)' //Petra Venj
}

updateCycleData();
updateVendorData();
updateXurData();
updateMsgData();

fs.watchFile(dataDir + '/cycles.json', updateCycleData);
fs.watchFile(dataDir + '/vendor.json', updateVendorData);
fs.watchFile(dataDir + '/xur.json', updateXurData);
fs.watchFile(dataDir + '/msg.json', updateMsgData);

app.engine('hbs', hbs.express4({
    partialsDir: __dirname + '/views/partials',
    defaultLayout: __dirname + '/views/layouts/main',
    layoutsDir: __dirname + '/views/layouts'
}));

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

app.get('/', (req, res) => {
    res.render('home', {
        page: data,
        layoutdata: layout
    });
})

app.get('/index', (req, res) => {
    res.redirect('/');
})

app.get('/index.html', (req, res) => {
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
        res.render('data/vendor', {
            page: vendorData[req.params.vendorhash],
            layoutdata: layout
        });
    } else {
        res.redirect('/data/vendor')
    }
})

app.get('/data/currentcycles', (req, res) => {
    res.render('data/currentcycles', {
        page: cyclesAPI,
        layoutdata: layout
    });
})

app.get('/guides/', (req, res) => {
    res.render('guides/welcome', { layoutdata: layout });
})

app.get('/guides/escalationprotocol', (req, res) => {
    res.render('guides/escalationprotocol', {
        page: cyclesAPI.escalationprotocol,
        layoutdata: layout
    });
})

app.get('/guides/blindwell', (req, res) => {
    console.log(cyclesAPI.citystatus);
    res.render('guides/blindwell', {
        page: cyclesAPI.citystatus,
        layoutdata: layout
    });
})

app.get('/guides/ascendantchallenge', (req, res) => {
    res.render('guides/ascendantchallenge', {
        page: cyclesAPI.ascendantchallenge,
        layoutdata: layout
    });
})

app.get('/guides/dawning', (req, res) => {
    res.render('guides/dawning', { layoutdata: layout });
})

app.get('/guides/spider', (req, res) => {
    res.render('guides/spider', { layoutdata: layout });
})

app.get('/guides/chalice', (req, res) => {
    res.render('guides/chalice', { layoutdata: layout });
})

app.get('/accessibility', (req, res) => {
    res.render('accessibility', { layoutdata: layout });
})

app.get('/archives', (req, res) => {
    res.render('archives', { layoutdata: layout });
})

app.get('/faq', (req, res) => {
    res.render('faq', { layoutdata: layout });
})

app.get('/settings', (req, res) => {
    res.render('settings', { layoutdata: layout });
})

app.get('/privacy-policy', (req, res) => {
    res.render('privacy-policy', { layoutdata: layout });
})

app.get('/friends', (req, res) => {
    res.render('friends', { layoutdata: layout });
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

app.listen(8000, () => {
    console.log('Server listening on port 8000...');
})

function updateCycleData() {
    let cyclesFile = fs.readFileSync(dataDir + '/cycles.json', 'utf8');
    cyclesAPI = JSON.parse(cyclesFile);

    let cityStatus;
    if (cyclesAPI.citystatus.id == 0) {
        cityStatus = "Shit ain't fucked, yo";
    } else if (cyclesAPI.citystatus.id == 1) {
        cityStatus = "Shit is moderately fucked, yo";
    } else {
        cityStatus = "Shit is completely fucked, yo";
    }

    data.cycles = {
        activenightfalls: cyclesAPI.activenightfalls,
        dailies: cyclesAPI.dailies,
        city: cityStatus,
        reckoning: cyclesAPI.reckoningbosses.boss
    }
}

function updateVendorData() {
    let vendorFile = fs.readFileSync(dataDir + '/vendor.json', 'utf8');
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
    xurAPI = JSON.parse(fs.readFileSync(dataDir + '/xur.json', 'utf8'));

    if (xurAPI.present) {
        if (xurAPI.found) {
            data.xurloc = xurAPI.planet;
            layout.xur = xurAPI.planet + ' > ' + xurAPI.zone + ' > ';
            switch (xurAPI.planet) {
                case 'Tower':
                    layout.xur += 'Behind Dead Orbit';
                    break;
                case 'Titan':
                    layout.xur += 'In a room';
                    break;
                case 'Io':
                    layout.xur += 'In his cave';
                    break;
                case 'Nessus':
                    layout.xur += 'On the barge';
                    break;
                case 'Earth':
                    layout.xur += 'On his cliff';
                    break;
                case 'Mercury':
                    layout.xur += 'See below';
                    break;
                case 'Mars':
                    layout.xur += 'See below';
                    break;
                case 'Tangled Shore':
                    layout.xur += 'See below';
                    break;
                case 'Dreaming City':
                    layout.xur += 'See below';
                    break;
                case 'Moon':
                    layout.xur += 'See below';
                    break;
            }
        } else {
            layout.xur = 'Xur\'s here, but we haven\'t found him yet';
        }
    } else {
        layout.xur = 'Xur\'s fucked off';
    }
}

function updateMsgData() {
    let msgFile = fs.readFileSync(dataDir + '/msg.json', 'utf8');
    msgData = JSON.parse(msgFile);

    layout.xurmsg = msgData.xurmsg;
    layout.psa = msgData.psa;

    data.riff = msgData.riff;
}
