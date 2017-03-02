'use strict';
const cheerio = require('cheerio');
const fs = require('fs');
const Webserver = require('./libs/webserver');
// function runRead(fileName) {
//     return new Promise((resolve, reject) => {
//         fs.readFile(fileName, 'utf8',(err, data)=>{
//             if(err)
//                 return reject(err);
//             resolve(data);
//         })
//     })
// }
// runRead('./data/test.html')
//     .then( data => {
//         ;
//             console.log(data.match(/csrf_token = \"(.*?)\";/i)[1]);
//     })
//     .catch(console.log);
const options = {
    port: 4000,
    file: `${__dirname}/data/test.html`
};

let server = new Webserver(options, 10);
