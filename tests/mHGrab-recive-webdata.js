const expect = require('chai').expect;
const MHGrab = require('../mhgrab');

var grab, opt, login;

describe('MHGrab' , function () {
    describe('.getRequest arguments, should return', function () {
        beforeEach( function() {
            opt = require('../data/data');
            login = require('../data/login');

            grab = new MHGrab();

        })
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
        it('html data if otions = {url: "https://ya.ru"} second argument is null', function() {
          let options = {
            uri: 'https://ya.ru/',
            method: 'GET'
          };

          grab.getRequest(options).then(resp => {
            expect(resp.data).to.match(/\<title\>Яндекс\<\/title\>/);
          })
          .catch(console.log)
        })
    })
    describe('.getRequest content MH', function () {
        it('should retrurn home page site MH, when first argument options request, second login couple [login, password]', function () {
            let opt = require('../data/data');
            let login = require('../data/login');

            grab.getRequest(opt, login['gm']).then(resp => {
              expect(resp.data).to.match(/medica#2/);
            })
            .catch(console.log)
        })
        it('should return current bild, when call function getMony', function () {
            expect(grab.getRequest(opt, login['gm']).getMony()).to.be.a('number');
        });
    })
})
