const common = require('../utils/common');
const auth = require('../utils/auth');


function verifyToken(requestBody) {
    if (!requestBody.user || !requestBody.user.email || !requestBody.token){
        return common.httpResponse(401, {
            verified: false, 
            message: 'Incorrect Body'
        });
    }


    const user = requestBody.user;
    const token = requestBody.token;
    const verification = auth.verify(user.email, token);

    if(!verification.verified) {
        return common.httpResponse(401, verification);
    }

    return common.httpResponse(200, {
        verified: true,
        message: 'Verified!',
        user: user,
        token: token
});

}

module.exports.verifyToken = verifyToken;
