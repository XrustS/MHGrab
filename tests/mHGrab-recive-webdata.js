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
            return    grab.getRequest(opt, login['gm']).then(resp => {
                  expect(resp).to.match(/medica#2/);
                })
                .catch(assert.fail)
        })
        it('should return current score, when call function getMony', function () {
            return grab.getRequest(opt, login['gm']).then(
                        resp => {
                            let score = grab.getMony(resp);

                            expect(Number(score)).to.be.a('number');
                        }).catch(assert.fail)
        })
        it('should return cirylic simbols to utf8, site data in encoding windows-1251', function () {
            return  grab.getRequest(opt, login['gm']).then(
                        resp => {
                            let resiveData = grab.getFetchData(resp, 'h1.heading-service');

                            expect(resiveData).to.be.eql('Услуги');
                        }).catch(assert.fail)
        });
    })
})
