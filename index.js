require('dotenv').config()
const express = require('express')
const router = require('./src/routes')
const port = 5000
const app = express()

app.use(express.json())

app.use("/uploads", express.static("uploads"));
app.use('/api/v1/', router)


app.listen(port, () => {
    console.log(`Your server running on port ${port}`)
})

