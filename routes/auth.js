const router = require('express').Router();
const User = require('../models/User');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');

// REGiSTER
router.post("/register", async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        lastname: req.body.lastname,
        name: req.body.name,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString(),
        isAdmin: req.body.isAdmin,
        image: req.body.image,
        address: req.body.address,
        dateBirth: req.body.dateBirth,
        phone: req.body.phone,
    });

    try {
        const savedUser = await newUser.save();
        // res.send(newUser);
        res.status(200).json(newUser);
    } catch (error) {
        res.status(500).json(error);
    }
});

//LOGIN
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        !user && res.status(401).json("Wrong Crendentials, The user does no exist!");

        if (user) {// this was not in the original code
            const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);
            const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

            OriginalPassword !== req.body.password && res.status(401).json("Wrong Crendentials, Password incorrect!");

            if (OriginalPassword === req.body.password) {// this was not in the original code
                // we create the access token, using  the "id" and the "_isAdmin" of the user 
                const accessToken = jwt.sign(
                    {
                        id: user._id,
                        isAdmin: user.isAdmin,
                    },
                    process.env.JWT_SEC,
                    { expiresIn: '3d' }
                );

                const { password, ...others } = user._doc; // with this we do not show the password in the reponse 

                // res.send(user);
                res.status(200).json({ ...others, accessToken });
            }
        }
    } catch (error) {
        res.status(500).json(error);
    }
});


// we are exporting 
module.exports = router;