var request = require('request');
// require('request-debug')(request);
request = request.defaults({jar: true});
const cheerio = require('cheerio');

function MHGrab(){
    let salf = this;

    salf.debug = false;

    salf.getRequest = function(options, loginParam){
        let login = loginParam ? loginParam : [],
        template = options;

        if( isObject(template) && Array.isArray(login)) {
            if(login.length == 2)
                template = inject(login).to(template);

            debug(`Options:  ${JSON.stringify(template)}`);

            return new Promise((resolve, reject) => {
                request(template, (err, response) => {
                    if(err)
                    return reject(err);

                    resolve(response);
                })
            })

        } else return false;
    }
    salf.getMony = function(htmlPage) {
        let result = fetch(htmlPage, '.old-cp-dengi > p > em');

        //result = clearSpace(result);
        debug(`RESULT FETCH: --- ${result}`);
        return result
    }

function clearSpace(htmlPage) {
    let str = '';

    str = htmlPage;
    return str.replace(/\t+|\n+/g," " );
}

function fetch(data, patt) {
    let $ = cheerio.load(data),
    pattern = patt ? patt: '';

    return  +$(pattern).text();
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
