//const jwt = require('jsonwebtoken');
const jwt = require('jsonwebtoken');
 
module.exports = (req, res, next) => {
   try {
       const token = req.headers.authorization.split(' ')[1];
       const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
       const userId = decodedToken.userId;
       req.auth = {
           userId: userId
       };
	next();
   } catch(error) {
    //console.log("ошмбка аутентификации", req.headers.authorization.split(' ')[1] );
    console.log("ошмбка аутентификации", req.headers)
       res.status(401).json({ error });
   }
};