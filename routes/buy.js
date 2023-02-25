const Buy = require("../models/Buy");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

//CREATE with token
router.post("/aunt", verifyToken, async (req, res) => {
  const newBuy = new Buy(req.body);

  try {
    const savedOrder = await newBuy.save();
    res.status(200).json(savedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});
//CREATE with out token
router.post("/", async (req, res) => {
  const newBuy = new Buy(req.body);

  try {
    const savedOrder = await newBuy.save();
    res.status(200).json(savedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedOrder = await Buy.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Buy.findByIdAndDelete(req.params.id);
    res.status(200).json("Buy has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET USER BUYS
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const orders = await Buy.find({ userId: req.params.userId });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

// //GET ALL
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const orders = await Buy.find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;