const config = require('config');
const morgan = require('morgan');
const debug = require('debug')('app:startup');
module.exports= function (){
    if(!config.get('jwtPrivateKey')){
        throw new Error ('Fatal Error')
    }
    if(process.env.NODE_ENV === "development"){
        app.use(morgan('tiny'));
        debug('Morgan enabled...');
    }
}