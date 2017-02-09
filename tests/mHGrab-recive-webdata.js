const expect = require('chai').expect;
const assert = require('chai').assert;
const MHGrab = require('../mhgrab');

var grab, opt, login;

describe('MHGrab' , function () {
    beforeEach( function() {
        opt = require('../data/data');
        login = require('../data/login');

        grab = new MHGrab();


    })
    describe('.getRequest arguments, should return', function () {

        // Tests

        it('false if method getRequest arguments empty', function () {
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
        it('Promise if first argument object {uri:"https://ya.ru/"}, second argument Array ', function () {
            expect(grab.getRequest({uri:'https://ya.ru/'},[])).to.be.instanceof(Promise)
        })
        it('html data if options = {url: "https://ya.ru"} second argument is null', function() {
          let options = {
            uri: 'https://ya.ru/',
            method: 'GET'
          };

        return  grab.getRequest(options).then(resp => {

                expect(resp).to.match(/\<title\>Яндекс\<\/title\>/);

                })
                .catch(assert.fail);
        })
    })
    describe('.getRequest content MH', function () {
        it('should retrurn home page site MH, when first argument options request, second login couple [login, password]', function () {
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
        it('should return cirylic simbols to utf8', function () {
            return  grab.getRequest(opt, login['gm']).then(
                        resp => {
                            let resiveData = grab.getFetchData(resp, 'h1.heading-service');

                            expect(resiveData).to.be.eql('Услуги');
                        }).catch(assert.fail)
        });
    })
})
