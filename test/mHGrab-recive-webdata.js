const expect = require('chai').expect;

describe('MHGrab' , function () {
    describe('correct formating input data', function () {
        it('should return false if method getRequest arguments empty', function () {
            let grab = new MHGrab();
            let result = grab.getRequest();

            expect(result).to.be.false;
        });
    });
});

function MHGrab(){
    let salf = this;

    salf.getRequest = function(){
        return false;
    }
}
