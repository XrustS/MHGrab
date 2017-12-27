'use strict';
const MHGrab = require('./mhgrab');
const options = require('./data/data');
const login = require('./data/login');

let grab = new MHGrab();

grab
  .getRequest(options, login['gm'])
  .then(() => {
    grab.getScore('10001');
  })
