const express = require('express');
const request = require('request-promise-native');
const fs = require('fs');

var app = express();

let data;

app.get('/data', (req, res) => {
    res.send(data);
})

refreshdata().then(() => {

    runRefresh();

    app.listen(8080, () => {
        console.log(`Server listening on port 8080...`);
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