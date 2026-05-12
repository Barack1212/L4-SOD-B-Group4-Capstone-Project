const http = require("http");

const server = http.createServer((request, response) => {
    response.write("<html>");
    response.write("<head><title>My Server</title></head>");
    response.write("<body><input type=\"text\" placeholder=\"Enter your name\"></body>");
    response.write("</html>");
    response.end();
})

server.listen(3000, () => {
    console.log("server have reached my server at 3000")
})

