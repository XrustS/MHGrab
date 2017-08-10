'use strict';
const MHGrab = require('./mhgrab');
const options = require('./data/data');
const login = require('./data/login');
const { URL } = require('url');

let grab = new MHGrab();
let url = new URL(options.url);
if(process.argv.length < 3) {
    for (let company in login) {
        grab
        .getRequest(options, login[company])
        .then(() => {
            let currentSum = grab.getMony();

            grab.getRequest({
                url: 'https://cp.masterhost.ru/pay',
                followAllRedirects: true,
                encoding: null,
                method: 'POST'
            }).then(() => {
                let score = grab.getIdScope();

                console.log(`${company} --- ${currentSum} --- ${score}`);
            })
        })
    }
} else {
    console.log(`We don\`t support arguments!`);
}
