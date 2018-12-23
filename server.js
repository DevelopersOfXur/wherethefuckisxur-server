const express = require('express');
const fs = require('fs');

var app = express();

app.get('/data', (req, res) => {
    let data = JSON.parse(fs.readFileSync('storage/data.json'));
    res.send(data);
})

app.get('/xur', (req, res) => {
    let data = JSON.parse(fs.readFileSync('storage/xur.json'));
    res.send(data);
})

app.listen(80, () => {
    console.log(`Server listening on port 80...`);
});