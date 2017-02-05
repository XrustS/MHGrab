const expect = require('chai').expect;

describe('MHGrab' , function () {
    describe('correct formating input data', function () {
        it('should return false if method getRequest arguments empty', function () {
            let grab = new MHGrab();
            let result = grab.getRequest();

            expect(result).to.be.false;
        });
        it('should return false if first argument is not Object', function () {
            let grab = new MHGrab();
            let result ='';

            result = grab.getRequest('str');

            expect(result).to.be.false;
        });
        it('should return false if second argument is unset or not Array', function () {
            let grab = new MHGrab();
            let result ='';

            result = grab.getRequest({},'str');

            expect(result).to.be.false;
        });
    });
});

function MHGrab(){
    let salf = this;

    salf.getRequest = function(options, loginParam){
        if(arguments.length != 0 || !isObject(options) || !Array.isArray(loginParam))
            return false;
        return true;
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
