'use strict';
const MHGrab = require('./mhgrab');
const options = require('./data/data');
const login = require('./data/login');
const { URL } = require('url');

let grab = new MHGrab();
let url = new URL(options.url);
let company={};
switch (process.argv[2]) {
    case '--show-curr':
        company[process.argv[3]] = login[process.argv[3]];
        getCurrStat(company);
        break;
    case '--get-score':
        company = login[process.argv[3]];
        let score = process.argv[3] ? process.argv[3] : 11670;
        getScore(score);
        break;
    default:
        getCurrStat();
}
function getCurrStat(company) {
    let loginArr = {};

    if(company){
        loginArr = company;
    } else {
        loginArr = login;
    }
    for (let item in loginArr) {
        grab
        .getRequest(options, loginArr[item])
        .then(() => {
            let currentSum = grab.getMony();
            console.log(`${item} --- ${currentSum} `);            
        })
    }
}
