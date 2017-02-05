const expect = require('chai').expect;
const MHGrab = require('../mhgrab');

var grab;

describe('MHGrab' , function () {
    describe('getRequest arguments', function () {
        beforeEach( function() {
            grab = new MHGrab();
        })
        // Tests

        it('should return false if method getRequest arguments empty', function () {
            expect(grab.getRequest()).to.be.false;
        });
        it('should return false if first argument is not Object', function () {
            expect(grab.getRequest('str')).to.be.false;
            expect(grab.getRequest(1)).to.be.false;
            expect(grab.getRequest([])).to.be.false;
        });
        it('should return false if second argument is unset or not Array', function () {
            expect(grab.getRequest({},'str')).to.be.false;
        });
        it('should return Promise if first argumen object options, second argument Array ', function () {
            expect(grab.getRequest({},[])).to.be.instanceof(Promise)
        });
    });
});
