'use strict';
const cheerio = require('cheerio');
const fs = require('fs');

function runRead(fileName) {
    return new Promise((resolve, reject) => {
        fs.readFile(fileName, 'utf8',(err, data)=>{
            if(err)
                return reject(err);
            resolve(data);
        })
    })
}
runRead('./data/test.html')
    .then( data => {
        ;
            console.log(data.match(/csrf_token = \"(.*?)\";/i)[1]);
    })
    .catch(console.log);
