'use strict';
var request = require('request');
// require('request-debug')(request);
request = request.defaults({jar: true});
const cheerio = require('cheerio');
const iconv = require('iconv-lite');
const fs = require('fs');
// const url = require('url');
const pdf = require('html-pdf');

function MHGrab(){
    var salf = this;
    salf.debug = false;

    salf.getRequest = function (options, loginParam){
        let login = loginParam || [],
        template = options;

        if( isObject(template) && Array.isArray(login)) {
            if(login.length == 2)
            template = inject(login).to(template);

            debug(`OPTIONS: --- ${JSON.stringify(template)}`);

            return new Promise((resolve, reject) => {
                // Использование потока для кодирования входных данных
                let local = 'utf8',
                chunks = [];
                request(template)
                .on('response', (resp) => {
                    switch(resp.headers['content-type']){
                        case 'text/html; charset=windows-1251':
                        local = 'win1251';
                        break;
                        default: local = 'utf8';
                    }
                })
                .on('data', chunk=>chunks.push(chunk))
                .on('end', () => {
                    let res = local !=='utf8' ?
                    iconv.decode(Buffer.concat(chunks), local) :
                    Buffer.concat(chunks);
                    debug(`----- BODY BEGIN -----\n\t${res ? `content\n\tlocal - ${local}` : "empty"}\n------- BODY END ------`);
                    resolve(salf.htmlData = res.toString())
                })
            })
        } else return false;
    }
    salf.getIdScope = function () {
        let result = fetch(salf.htmlData, "input[name^='lbill_id']", true);

        return Number(result.val());
    }
    salf.getCSRFKey = function () {
        return salf.htmlData.match(/csrf_token = \"(.*?)\";/i)[1] || false;
    }
    salf.getSearch = function (regExp){
        // возвращает результат удовлетворяющий регулярному выражению
        return salf.htmlData.match(regExp);
    }
    salf.getMony = function () {
        let result = fetch(salf.htmlData, '.old-cp-dengi > p > em');

        debug(`RESULT FETCH: --- ${result}`);
        return result
    }
    salf.getFetchData = function(patt){
        let result = fetch(salf.htmlData, patt);

        debug(`getFETCH: --- Pattern --${patt} \n Result -- ${result}`);
        return result || false;
    }
    salf._clearPage = function () {
        salf.htmlData = salf.htmlData
        .replace(/\t+|\n+/g, " " );
        return salf;
    }
    salf.getScore = function (score, fileName) {
        // GET(url/pay)->POST({options: setOptions, url: 'bill/pay_rur'})->
        let opt = {
            method: 'POST',
            url: 'https://cp.masterhost.ru/pay',
            followAllRedirects: true,
            encoding: null,
            form: {
                sum: score,
                lbill_id: '', //уникален для каждой организации
                csrf_token: ''
            }
        };

        return salf.getRequest(opt)
        .then(() => {
            opt.form.lbill_id = salf.getIdScope();
            opt.form.csrf_token = salf.getCSRFKey();
            opt.url = 'https://cp.masterhost.ru/bill/pay_rur';
            return salf.getRequest(opt)
        })
        .then(async () => {
            let link = await fetch(salf.htmlData, "a:contains('Счет для юридических лиц')", true).attr("href");

            return  salf.getRequest({
                url: link,
                followAllRedirects: true,
                encoding: null
            })
        })
        .then(() => salf)
        // .then(() => {
        //     // save result to file
        //     return salf.toPDF(fileName)
        // })
    }
    salf.toPDF = function (fileName) {
        debug(`->toPDF: ${fileName}`);
        return salf._saveToFile(fileName, salf.htmlData);
    }
    salf._saveToFile = function(fileName, data) {
        return new Promise((resolve, reject) => {
            if(!data || !fileName){
                return reject(false);
            }
            let pdfOptions = {
                format: 'Letter'
            }
            debug(`---> Being create PDF file: ${fileName} \n DATA: ${data}\n`);
            pdf.create(data, pdfOptions)
            .toFile(fileName,  (err, res) => {
                if(err)
                return reject(`Error write file! \n ${err}`);
                debug(`----> File pdf is saved`);
                return resolve(`successfully save file ${res.filename}`);
            })
        })
    }

    function fetch(data, patt, fullResult=false) {
        let $ = cheerio.load(data),
        pattern = patt ? patt: '';

        return  fullResult == true ? $(pattern) : $(pattern).text();
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
