require('dotenv').config()
const AWS = require('aws-sdk');
AWS.config.update({
    region: 'eu-west-2'
})

const settings = {
    region: 'eu-west-2',
    endpoint: new AWS.Endpoint(process.env.LOCAL_ENDPOINT)
}

const dynamoDB = new AWS.DynamoDB.DocumentClient(process.env.AWS_SAM_LOCAL ? settings : null);
const userTable = 'journal-users';
const common = require('../utils/common')
const bcrypt = require('bcryptjs')



 async function register(userData) {
    const name = userData.name;
    const email = userData.email;
    const password = userData.password;

    if (!userData || !name || !email || !password) {
        return common.buildResponse(401, {message: "All fields are mandatory"})
    }

    const dynamoUser = await getUser(email)
    if (dynamoUser && dynamoUser.email){
        return common.buildResponse(401, {message: 'This email address is already registered.'})
    }


    const hashedPassword = bcrypt.hashSync(password, 10)

    const user = {
        userId: Math.floor(Date.now() / 1000),
        name: name,
        email: email,
        password: hashedPassword
    }

    const saveUserRes = await saveUser(user)

    if(!saveUserRes){
        return common.buildResponse(503, {message: 'Error'})
    }

    return common.buildResponse(200, {name: name})

}

async function getUser(email) {
    const params = {
        TableName: userTable,
        Key: {
            email: email
        }
    }

    return await dynamoDB.get(params).promise().then(res => {
        return res.Item;
    }, error => {
        console.error('There was an error', error)
    })
    }

async function saveUser(user) {
    const params = {
        TableName: userTable,
        Item: user
    }

    return await dynamoDB.put(params).promise().then(()=> {
        return true;
    }, error => {
        console.error('There was an error', error)
    })
}

    module.exports.register = register

