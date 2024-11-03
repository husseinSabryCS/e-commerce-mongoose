const jwt = require('jsonwebtoken');



class Token {

    static verifyToken(req, res,next) { 
       
        const token = req.headers.token;
        if (token) {
            
            try {
            const secret=  process.env.JWT_SECRET
                
                const decoded = jwt.verify(token, secret);
                req.user = decoded 
                 
                next()
            } 
            catch (err) {
                return res.status(500).json({message : err.message})
            }
    
        } else {
            return res.status(401).json('Required Login')
        }
    } 
    
    static authorize(roles) {
        return (req, res, next) => {
            if (!req.user || !roles.includes(req.user.role)) {
                return res.status(403).json({
                    errors: [{ msg: "Unauthorized access" }]
                });
            }
            next();
        };
    }
    

  }



module.exports = Token 