const express = require('express');
const app = express();
const mongoose = require("mongoose");
const dotenv = require('dotenv');

// we import de schema for our data base 
const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');
const productRoute = require('./routes/product');
const cartRoute = require('./routes/cart');
const orderRoute = require('./routes/order');
const stripeRoute = require('./routes/stripe');
const cors = require('cors')

dotenv.config();

mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log("Connected to DB"))
.catch((err)=>{
    console.log(err)
})

app.use(cors())

app.use(express.json()); // with this we allow to the app to take any JSON object 

app.use("/api/auth",authRoute);
app.use("/api/users",userRoute);
app.use("/api/products",productRoute);
app.use("/api/carts",cartRoute);
app.use("/api/orders",orderRoute);
app.use("/api/checkout",stripeRoute);

app.listen(process.env.PORT || 4000,()=>{
    console.log("Back-End running on "+ process.env.PORT )
})