const http = require("http");

const server = http.createServer((req, res) => {
    console.log("success")
})

server.listen(3000, () => {
    console.log("server have reached my server at 3000")
})

