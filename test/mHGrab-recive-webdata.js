const expect = require('chai').expect;
const MHGrab = require('../mhgrab');

var grab;

describe('MHGrab' , function () {
    describe('getRequest arguments should return', function () {
        beforeEach( function() {
            grab = new MHGrab();
        })
        // Tests

        it('false if method getRequest arguments empty', function () {
            expect(grab.getRequest()).to.be.false;
        });
        it('false if first argument is not Object', function () {
            expect(grab.getRequest('str')).to.be.false;
            expect(grab.getRequest(1)).to.be.false;
            expect(grab.getRequest([])).to.be.false;
        });
        it('false if second argument is unset or not Array', function () {
            expect(grab.getRequest({},'str')).to.be.false;
        });
        it('Promise if first argumen object options, second argument Array ', function () {
            expect(grab.getRequest({},[])).to.be.instanceof(Promise)
        });
        -it('html data if otions = {url: "https://ya.ru"} second argument is null', function() {
          let opt = {
            uri: 'https://ya.ru/',
            method: 'GET'
          };

          grab.getRequest(opt)
          .resolve((response) => {
            let data = response.body;

            expect(data).to.match(/\<title\>Яндекс\<\/title\>/);
          })
          // .catch(error => console.log(error))

        });
    });
});
