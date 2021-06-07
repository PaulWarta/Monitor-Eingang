let http = require('http');
const fs = require('fs');
const dir = './ticker.json';
let data;

fs.readFile(dir, (err, files) => {
    data = JSON.parse(files);
    console.log(data);
});



