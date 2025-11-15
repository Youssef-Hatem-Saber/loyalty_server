const express = require('express')
const mongoose = require('mongoose');
const cors = require("cors");
const connectDB = require("./config/db");

const app = express()

app.use(cors());
app.use(express.json());

require("dotenv").config();
app.get('/', (req, res) => {
    res.send('Youssef Hatem Loyalty App');
});

const loginRouter = require("./routers/login.router");
app.use("/api/auth", loginRouter);
    
const profileRouter = require("./routers/profile.router");
app.use("/api/profile", profileRouter);

const productRoutes = require('./routers/proudct.router');
app.use("/api/products",productRoutes);

const cartRouter = require("./routers/cart.router");
app.use("/api/cart", cartRouter);

const orderRouter = require("./routers/order.router");
app.use("/api/orders", orderRouter);


const loyaltyRouter = require("./routers/loyalty.router");
app.use("/api/loyalty", loyaltyRouter);

connectDB
    .then(() => {
        console.log('Connected to database!');
        app.listen(process.env.PORT, () => {
            console.log('Server run on '+process.env.PORT );
        });
    })
    .catch(err => console.log('Failed', err));
