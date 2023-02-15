const jwt = require("jsonwebtoken");

function generateToken(userData) {
  if (!userData) {
    return null;
  }

  return jwt.sign(userData, process.env.JWT_SECRET, {
    expiresIn: "100000",
  });
}

function verify(email, token) {
  return jwt.verify(token, process.env.JWT_SECRET, (error, res) => {
    if (error) {
      return {
        verified: false,
        message: "Invalid token",
      };
    }

    if (res.email !== email) {
      return {
        verified: false,
        message: "Invalid user",
      };
    }

    return {
      verified: true,
      message: "User is verified!",
    };
  });
}

module.exports.generateToken = generateToken;
module.exports.verify = verify;
