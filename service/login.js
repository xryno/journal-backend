require('dotenv').config()
const AWS = require('aws-sdk');
AWS.config.update({
    region: 'eu-west-2'
});

const settings = {
    region: 'eu-west-2',
    endpoint: new AWS.Endpoint(process.env.LOCAL_ENDPOINT)
}

const dynamoDB = new AWS.DynamoDB.DocumentClient(process.env.AWS_SAM_LOCAL ? settings : null);
const userTable = 'journal-users';
const common = require('../utils/common');
const bcrypt = require('bcryptjs');
const auth = require('../utils/auth');

 async function login(user) {
    const email = user.email;
    const password = user.password;
    if (!user || !email || !password ) {
        return common.buildResponse(401, {message: 'Email address and password are required'});
    }

    const dynamoUser = await getUser(email);
    if (!dynamoUser || !dynamoUser.email) {
        return common.buildResponse(403, { message: 'Email address or password is incorrect'});
    }

    if (!bcrypt.compareSync(password, dynamoUser.password)) {
        return common.buildResponse(403, { message: 'Email address or password is incorrect'});
    }

    const userData = {
        userId: dynamoUser.userId,
        name: dynamoUser.name,
        email: dynamoUser.email
    };

    const token = auth.generateToken(userData);

    const response = {
        user: userData,
        token: token
    };

    return common.buildResponse(200, response);

}

async function getUser(email) {
    const params = {
        TableName: userTable,
        Key: {
            email: email
        }
    };

    return await dynamoDB.get(params).promise().then(res => {
        return res.Item;
    }, error => {
        console.error('There was an error', error);
    });
}

module.exports.login = login;