const router = require("express").Router();
const dotenv = require('dotenv');
dotenv.config();

const stripe = require("stripe")(process.env.STRIPE_KEY);
// const stripe = require("stripe")('sk_test_51LwuQPBCQsKLwo4Bs85T9hv1pLAAVmQrKkbJVdxSpGFoprT4HxCbkO0v8EetHIvrDnZhvf8bjEEofgezaylLfTTc00fgVUwSN5');


router.post("/payment", (req, res) => {
    console.log(req.body)
    stripe.charges.create(
        {
            source: req.body.tokenId,
            amount: req.body.amount,
            currency: "usd",
        },
        (stripeErr, stripeRes) => {
            if (stripeErr) {
                res.status(500).json(stripeErr);
            } else {
                res.status(200).json(stripeRes);
                console.log(stripeRes)
            }
        }
    );
});

module.exports = router;