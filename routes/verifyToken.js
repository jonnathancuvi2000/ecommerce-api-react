const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token;
    if (authHeader) {
        // this is how our token is 
        // Berear eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzMzcwZDJmMjI0N2ExNGRlZTVjMzJjNiIsImlhdCI6MTY2NDcyNjY2MywiZXhwIjoxNjY0OTg1ODYzfQ.jlsW_Yy2end1Ft2Gx-b6oS-Ju-PNlTgeDqF4xmwu7mg
        // so we have to split it adn take second param 
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SEC, (err, user) => {
            if (err) {
                return res.status(401).json("Token is not valid!");
            } else {
                // console.log(user); -> it just gives back the id of the use, and not the entired user
                req.user = user;// we send the user un the request and use it in the funtion "PUT in user fail"
            }
            next(); // with this we leave this funtion a we return to the router 
        })
    } else {
        return res.status(401).json("You are not authenticated!");
    }
}

const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        }else{
            res.status(403).json("Your are not alowed to do that!")
        }
    })

}


const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next();
        }else{
            res.status(403).json("Your are not alowed to do that, ADMIN!")
        }
    })

}


module.exports = { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin }