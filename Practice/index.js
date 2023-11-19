// app.get("/",(req, res)=>{
//     fs.readFile('chatbot.html',function(err,data){
//         res.writeHead(200,{'Content-Type':'text/html'
//         });
//         res.end(data)
// })

//alternate way
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/chatbot.html");
});
app.get("/script.js", (req, res) => {
  res.sendFile(__dirname + "/chatbot.html");
});

io.on("connection", (socket) => {
  socket.on("disconnect", () => {
    console.log("a user disconnected");
  });
  socket.on("chat message", (msg) => {
    console.log("message: " + msg);
    io.emit("chat from server", msg);
  });
  console.log("a user connected");
});
server.listen(3000, () => {
  console.log("listening on *:3000");
});
