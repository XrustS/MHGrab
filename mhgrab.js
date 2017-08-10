'use strict';
var request = require('request');
// require('request-debug')(request);
request = request.defaults({jar: true});
const cheerio = require('cheerio');
const iconv = require('iconv-lite');
const fs = require('fs');
// const url = require('url');
// const jsPDF = require('node-jspdf');

function MHGrab(){
    var salf = this;
    salf.debug = false;

    salf.getRequest = function(options, loginParam){
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
    salf.getSearch = function(regExp){
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
    salf.getScore = function (score) {
      // GET(url/pay)->POST({options: setOptions, url: 'bill/pay_rur'})->
      // ParsceLink()
      let opt = {
        method: 'POST',
        url: 'https://cp.masterhost.ru/pay',
        followAllRedirects: true,
        encoding: null,
        form: {
          sum: "11567",
          lbill_id: '', //уникален для каждой организации
          csrf_token: ''
        }
      };
      // let doc = new jsPDF();

      salf.getRequest(opt).
      then(() => {
        opt.form.lbill_id = salf.getIdScope();
        opt.form.csrf_token = salf.getCSRFKey();
        opt.url = 'https://cp.masterhost.ru/bill/pay_rur';
        return salf.getRequest(opt)
      })
      .then(() => {
        let link = fetch(salf.htmlData, "a:contains('Счет для юридических лиц')", true).attr("href");

        salf.getRequest({
          url: link,
          followAllRedirects: true,
          encoding: null
        })
        .then(() => {
          // save result to file HTML
          fs.writeFile('outHTML.html', self.htmlData);
          // doc.text(fetch(salf.htmlData, "body", true), 15, 15);
          // doc.save(__dirname+'/firstScore.pdf');
        })
      })

    }
    salf._saveToFile = function(fileName, data) {
      if(!data || !fileName){
          return false;
          }
      return new Promise((resolve, reject) => {
          fs.writeFile(fileName, data, (err) => {
            if(err)
              return reject(`Error write file! \n ${err}`);
            resolve(`successfully save file ${fileName}`);
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
