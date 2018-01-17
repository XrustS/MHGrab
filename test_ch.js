'use strict';
const MHGrab = require('./mhgrab');
const options = require('./data/data');
const login = require('./data/login');

let grab = new MHGrab();

grab
  .getRequest(options, login['de'])
  .then(() => grab.getScore('1000', 'xxx1.pdf'))
  .then(res => res.toPDF(`${__dirname}/saveFiles/test.pdf`))
  .then( ok => console.log('File is saved'))
  .catch( err => console.log(`!!! Error >>>${err}`))
