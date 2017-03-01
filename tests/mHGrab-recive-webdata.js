const expect = require('chai').expect;
const assert = require('chai').assert;
const MHGrab = require('../mhgrab');


let grab, opt, login;

describe('MHGrab' , function () {
    beforeEach( function() {
        opt = require('../data/data');
        login = require('../data/login');

        grab = new MHGrab();
    })
    describe('.getRequest arguments, should return', function () {

        // Tests

        it('false if arguments empty', function () {
            expect(grab.getRequest()).to.be.false;
        })
        it('false if first argument is not Object', function () {
            expect(grab.getRequest('str')).to.be.false;
            expect(grab.getRequest(1)).to.be.false;
            expect(grab.getRequest([])).to.be.false;
        })
        it('false if second argument is not Array', function () {
            expect(grab.getRequest({},'str')).to.be.false;
        })
    })
    describe('.getRequest content', function () {
        it('Promise if first argument object {uri:"https://ya.ru/"}', function () {
            expect(grab.getRequest({uri:'https://ya.ru/'})).to.be.instanceof(Promise)
        })
        it('html page ya.ru if url: "https://ya.ru"', function() {

              let options = {
                uri: 'https://ya.ru/',
                method: 'GET'
              };

            return  grab.getRequest(options).then(resp => {

                    expect(resp).to.match(/\<title\>Яндекс\<\/title\>/);

                    })
                    .catch(assert.fail);
        })
        it('should retrurn home page site MH, when first argument options connection, second login couple [login, password]', function () {
            this.timeout(5000); // timeout is increased
            return    grab.getRequest(opt, login['gm']).then(resp => {
                  expect(resp).to.match(/medica#2/);
                })
                .catch(assert.fail)
        })
        it('should return current score, when call function getMony', function () {
            this.timeout(5000); // timeout is increased
            return grab.getRequest(opt, login['gm']).then(
                        resp => {
                            let score = grab.getMony();

                            expect(Number(score)).to.be.a('number');
                        }).catch(assert.fail)
        })
        it('should return cirylic simbols to utf8, site data in encoding windows-1251', function () {
            this.timeout(5000); // timeout is increased
            return  grab.getRequest(opt, login['gm']).then(
                        resp => {
                            let resiveData = grab.getFetchData('h1.heading-service');

                            expect(resiveData).to.match(/Услуги/);
                        })
        })
        it('should return "csrf_token" when call function getCSRFKey', function () {
            const fs = require('fs');
            const http = require('http');
            const options = {
                url: 'http://localhost:4000',
                port: 4000,
                method: 'GET'
            };
            const html = fs.createReadStream('./data/test.html');
            const server = http.createServer((req, res) =>{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');
                html.pipe(res);
            }).listen(options.port||3333, () => console.log('Server is start!'));

            (function countDown(counter) {
                if(counter > 0)
                return setTimeout(countDown, 1000, counter--);

                console.log(counter);
                server.close(() => console.log('Server closed!'));
            })(10);


            return grab.getRequest(options)
                    .then(
                        resp => {
                            let result = grab.getCSRFKey();

                            expect(result).to.be.eql('aeDAZR22osVVTEMtW3mnuXwmuUFugBEZ');
                    })
        });
    })
})
