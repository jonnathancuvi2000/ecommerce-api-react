const mongoose = require("mongoose");

const BuySchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    cartInfo: {
      products: [
        {
          categories: [{ type: String },],
          createdAt: { type: String },
          desc: { type: String, required: true },
          img: { type: String, required: true },
          inStock: { type: Boolean, default: false },
          price: { type: Number, required: true },
          quantity: { type: Number, required: true },
          size: { type: String },
          title: { type: String, required: true },
          updatedAt: { type: String },
          _id: { type: String },
        },
      ],
      quantity: { type: Number, required: true },
      totalPrice: { type: Number, required: true },
    },
    paymet: { type: String, required: true },
    shippingInfo: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      country: { type: String, required: true },
      fullName: { type: String, required: true },
      postalCode: { type: String, required: true },
    }
  },
  { timestamps: true }
);


module.exports = mongoose.model("Buy", BuySchema);