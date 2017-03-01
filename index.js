'use strict';
const MHGrab = require('./mhgrab');
const options = require('./data/data');
const login = require('./data/login');

let grab = new MHGrab();

for (let company in login) {
    grab
        .getRequest(options, login[company])
        .then((resp) => {
            let score = grab.getMony(resp);

            console.log(`${company} --- ${score}`);
        })
}
// Modification options request

// grab
//     .getRequest(options, login['ms'])
//     .then( resp => {
//         grab.getFetchData(resp,'script')
//     })
