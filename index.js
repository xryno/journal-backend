const registerService = require('./service/register');
const loginService = require('./service/login');
const verifyTokenService = require('./service/verifytoken');
const addEntryDB = require('./dbOperations/addEntry')
const getEntriesDB = require('./dbOperations/getEntry')
const common = require('./utils/common')





exports.handler = async (event) => {
    let response;
    
    switch(true){
        case event.httpMethod === 'GET' && event.path === '/status':
            response = common.httpResponse(200);
            break;
         case event.httpMethod === 'POST' && event.path === '/register':
            const registerBody = JSON.parse(event.body)
            response = await registerService.register(registerBody)
            break;
             case event.httpMethod === 'POST' && event.path === '/login':
                const loginBody = JSON.parse(event.body)
                response = await loginService.login(loginBody)
            break;
             case event.httpMethod === 'POST' && event.path === '/verifytoken':
                const verifyBody = JSON.parse(event.body)
                response = await verifyTokenService.verifyToken(verifyBody)
            break;
            
             case event.httpMethod === 'POST' && event.path === '/entries':
                const entryBody = JSON.parse(event.body)
                response = await addEntryDB.addEntry(entryBody)
            break;
            
            case event.httpMethod === 'GET' && event.path === '/entries':
                response = await getEntriesDB.getEntries(event.queryStringParameters.userId)
              
            break;
    }
    
    return response;
  
};


