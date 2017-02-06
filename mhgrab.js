var request = require('request');
// require('request-debug')(request);
request = request.defaults({jar: true});

function MHGrab(){
  let salf = this;

  salf.debug = false;

  salf.getRequest = function(options, loginParam){
    let login = loginParam ? loginParam : [];

    if( isObject(options) && Array.isArray(login)) {
      if(salf.debug) console.log('Options: %s', JSON.stringify(options));

      return new Promise((resolve, reject) => {
        request(options, (err, response) => {
          if(err)
          return reject(err);
          resolve(response);
        })
      })
    } else return false;

  }
  function isObject(obj) {
    if( typeof(obj) === 'object' ){
      let result = obj.toString()
      .replace(']','')
      .split(' ')
      .pop();

      if ( result === 'Object' )
      return true;
    }
    return false;
  }
  return salf;
}
module.exports = MHGrab;
