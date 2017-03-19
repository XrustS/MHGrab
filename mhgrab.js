'use strict';
var request = require('request');
// require('request-debug')(request);
request = request.defaults({jar: true});
const cheerio = require('cheerio');
const iconv = require('iconv-lite');

function MHGrab(){
    var salf = this;

    salf.debug = false;
    salf.htmlData = '';

    salf.getRequest = function(options, loginParam){
        let login = loginParam || [],
        template = options;

        if( isObject(template) && Array.isArray(login)) {
            if(login.length == 2)
            template = inject(login).to(template);

            debug(`OPTIONS: --- ${JSON.stringify(template)}`);

            return new Promise((resolve, reject) => {
                request(template, (err, response, body) => {

                    if(!err && response.statusCode == '200'){
                        switch (response.headers['content-type']) {
                            case 'text/html; charset=windows-1251':
                            salf.htmlData = iconv.decode(body,'win1251');
                            break;
                            default:
                            salf.htmlData = body;
                        }
                        salf._clearPage();
                        debug(`TRANSFORM BODY clearSpase: --- ${salf.htmlData}`);
                        return resolve(salf.htmlData);

                    } else return reject(err);

                })
            })

        } else return false;
    }
    salf.getIdScope = function () {
        let result = fetch(salf.htmlData, ".servicePropsBlock");

        return Number(result.match(/\b\d+/)[0]) || false;
    }
    salf.getCSRFKey = function () {
        return salf.htmlData.match(/csrf_token = \"(.*?)\";/i)[1] || false;
    }
    salf.getSearch = function(regExp){
        // возвращает резултат удовлетворяющий регулярному выражению
        return salf.htmlData.match(regExp);
    }
    salf.getMony = function() {
        let result = fetch(salf.htmlData, '.old-cp-dengi > p > em');

        debug(`RESULT FETCH: --- ${result}`);
        return result
    }
    salf.getFetchData = function(patt){
        let result = fetch(salf.htmlData, patt);

        debug(`getFETCH: --- Pattern --${patt} \n Result -- ${result}`);
        return result || false;
    }
    salf._clearPage = function() {
        salf.htmlData = salf.htmlData
                            .replace(/\t+|\n+/g, " " );
        return salf;
    }

    function fetch(data, patt) {
        let $ = cheerio.load(data),
        pattern = patt ? patt: '';

        return  $(pattern).text();
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
