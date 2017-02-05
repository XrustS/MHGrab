function MHGrab(){
    let salf = this;

    salf.getRequest = function(options, loginParam){
        if( isObject(options) && Array.isArray(loginParam)) {
            return new Promise((resolve, reject) => {

            })
        } else return false;

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
