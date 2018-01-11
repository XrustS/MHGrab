'use strict';
const MHGrab = require('./mhgrab');
const options = require('./data/data');
const login = require('./data/login');

let grab = new MHGrab();

grab
  .getRequest(options, login['vn'])
  .then(() => {
    grab.getScore('11340');
}).catch( err => console.log(err))
