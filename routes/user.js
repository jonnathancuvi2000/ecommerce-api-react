const User = require('../models/User');
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken');
const router = require('express').Router();

router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    // if the user change its password we have to encryp again 
    // console.log(req.body);
    // req.params.id -> this is teh param send it from the client (frontend)
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString();
    }

    // update our user after we have changed our password just in case that the user has changed 
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body // update our user
            },
            { new: true }
        );
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json(error)
    }

})

router.delete('/:id',verifyTokenAndAuthorization, async (req,res) =>{
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted...")
    } catch (error) {
        res.status(500).json(error)
    }
})

router.get('/find/:id',verifyTokenAndAdmin, async (req,res) =>{
    try {
        const userAdmin = await User.findById(req.params.id);
        const { password, ...others } = userAdmin._doc; // with this we do not show the password in the reponse 
        // res.send(user);
        res.status(200).json(others);
    } catch (error) {
        res.status(500).json(error)
    }
})

router.get('/',verifyTokenAndAdmin, async (req,res) =>{
    console.log(req)
    const query = req.query.new;
    try {
        const users = query
        ? await User.find().sort({_id: -1}).limit(5)
        : await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json(error)
    }
});

//GET USER STATS (estadisticas)

router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));// this allos us to take the last year, that is, the year "2021"

    try {
      const data = await User.aggregate([
        { $match: { createdAt: { $gte: lastYear } } },
        {
          $project: {
            month: { $month: "$createdAt" },
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: 1 },
          },
        },
      ]);
      res.status(200).json(data)
    } catch (err) {
      res.status(500).json(err);
    }
  });

// we are exporting 
module.exports = router;