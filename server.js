const express = require('express');
const exphbs  = require('express-handlebars');
const fs = require('fs');

var app = express();

let data;

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
    res.render('index', data);
})

app.get('/index', (req, res) => {
    res.render('index', data);
})

app.get('/guides', (req, res) => {
    res.render('guides', data);
})

app.get('/spider', (req, res) => {
    res.render('spider', data);
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
    res.send(data);
})

app.use(express.static('public'));

refreshdata().then(() => {

    runRefresh();

    app.listen(80, () => {
        console.log(`Server listening on port 80...`);
    });
});

function runRefresh() {
    refreshdata().then(() => {
        let currentMs = (new Date()).getTime();
        let msThroughDay = currentMs % 86400000;
        let nextRun;
        if (msThroughDay > 61200000) {
            nextRun = 86400000 - msThroughDay;
        } else {
            nextRun = 61200000 - msThroughDay;
        }        
        queueNext(nextRun);
    }, () => {
        queueNext(10000);
    })    

}

async function refreshdata() {
    let newdata = JSON.parse(fs.readFileSync('storage/data.json'));
    if (newdata == data) {
        throw 'DupeData';
    } else {
        data = newdata;
    }
}

function queueNext(nextRun) {
    setTimeout(() => {
        runRefresh();
    }, nextRun)
}