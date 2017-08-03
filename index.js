'use strict';
const MHGrab = require('./mhgrab');
const options = require('./data/data');
const login = require('./data/login');
const { URL } = require('url');

let grab = new MHGrab();
let url = new URL(options.url);

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
