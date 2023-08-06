require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')//
const path = require('path')
const user_routes = require('./routes/user_routes')
const category_routes = require('./routes/category_routes')
const product_routes = require('./routes/product_routes')
const cart_routes=require('./routes/cart_routes')
const order_routes=require('./routes/order_routes')
const address_routes=require('./routes/address_routes')

const app = express()
app.use(cors())

const DB_URI = (process.env.NODE_ENV === 'test') 
    ? process.env.TEST_DB_URI 
    : process.env.DB_URI
console.log(DB_URI)

mongoose.connect(DB_URI)
    .then(() => {
        console.log('connected to mongodb server')
        
    }).catch((err) => console.log(err))


// application level middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`)
    next()
})

app.use(
    "/images",
    express.static(path.join(__dirname, "/images"))
);

// starts with(^) / or ends with($) / or is index or index.html then 
app.get('^/$|index(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'))
})

//express defined middleware
app.use(express.json())


app.use('/users', user_routes)
// app.use(auth.verifyUser)
app.use('/category', category_routes)
app.use('/products', product_routes)
app.use('/cart',cart_routes)
app.use('/order',order_routes)
app.use('/address',address_routes)

// error handling middleware
// when there is value in err parameter then it gets executed

app.use((err, req, res, next) => {
    console.log(err.stack)  
    if (res.statusCode == 200) res.status(500)
    res.json({ "err": err.message })
})

module.exports = app