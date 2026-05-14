const express = require('express')
const app = express()

app.get('/', (req, res) => {
    res.send("connected successfully")
})

app.listen(3000, () => {
    console.log("server on http://localhost:3000")
})