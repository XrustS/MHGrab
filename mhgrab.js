var request = require('request');
// require('request-debug')(request);
request = request.defaults({jar: true});

function MHGrab(){
  let salf = this;

  salf.debug = false;

  salf.getRequest = function(options, loginParam){
    let login = loginParam ? loginParam : [],
        template = options;

    if( isObject(template) && Array.isArray(login)) {
        if(login.length == 2)
            tempalte = inject(login).to(template);

      debug(`Options:  ${JSON.stringify(options)}`);

      return new Promise((resolve, reject) => {
        request(options, (err, response) => {
          if(err)
            return reject(err);

          resolve(response);
        })
      })
    } else return false;
  }
  function inject(loginParam) {
      return {
          to: function(template){
              template.form.login = loginParam[0];
              template.form.password = loginParam[1];
              return template;
          }
      }
  }
  function debug(mes){
      if(salf.debug)
        console.log(mes);
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
