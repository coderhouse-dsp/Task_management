const { verify } = require('jsonwebtoken');

const isAuth = req => {
  const authorization = req.headers['authorization'];
  if (!authorization) throw new Error('You need to login.');
  // Based on 'Bearer ksfljrewori384328289398432'
  const token = authorization.split(' ')[1];
  console.log("token: " + token);
  const  userId  = verify(token, process.env.ACCESS_TOKEN_SECRET);
  console.log("userId: " + userId)
  return userId;
};

module.exports = {
  isAuth,
};