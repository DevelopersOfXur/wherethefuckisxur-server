const express = require('express');
const request = require('request-promise-native');
const fs = require('fs');
const Datastore = require('@google-cloud/datastore');
const datastore = new Datastore();

var app = express();

var data;

const key = datastore.key(['Bungie Data', 'data']);

app.get('/data', (req, res) => {
    res.send(data);
})

refreshdata().then(() => {

    nextFetch();

    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}...`);
    });
});

async function refreshdata() {
    datastore.get(key, (err, entity) => {
        data = entity;
    })
}

function nextFetch() {
    let currentMs = (new Date()).getTime();
    let msThroughDay = currentMs % 86400000;
    let nextRun;
    if (msThroughDay > 61200000) {
        nextRun = 86400000 - msThroughDay;
    } else {
        nextRun = 61200000 - msThroughDay;
    }
    setTimeout(() => {
        refreshdata().then(() => {
            nextFetch();
        })
    }, nextRun)
}