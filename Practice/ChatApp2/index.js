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
const userBase = require("./userBase/user.js");
// const { compileFunction } = require("vm");

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/index.css", (req, res) => {
  res.sendFile(__dirname + "/index.css");
});
//middlewares  
app.use(function (req , res , next){
  
  console.log(req.url , req.method)
  next()  //ASYNCHRONUS KAAM KRNE KE LIYE (GO TO NEXT MIDDLEWARE)
})



app.get("/script.js", (req, res) => {
  res.sendFile(__dirname + "/script.js");
});

io.on("connection", (socket) => {
  socket.on("disconnect", () => {
    console.log("a user disconnected");
  });

  socket.on("connect user", updateUser(socket));   
  
  console.log("a user connected");
  
  socket.on("update user", function (userData) {
    updateConnectedUser(socket, userData);
  });
  
  socket.on("search friend", function (friendName){  //ensures that the data is recieved 
    searchForFriendName(friendName, socket)
  });   


  socket.on("chat message", function (chatData) {
    console.log(chatData)
    handleChatMessage(chatData);
  });


});
function updateUser(socket) {  // to get socket access (higher order function)
  return function (userName) {
    console.log(userName)
    let userData = userBase.getUser(userName);

    if (!userData) {
      // create a new User
      userData = userBase.setUserNames(socket, userName);
    }
    socket.emit("user updated", userData.data);
  };
}
function updateConnectedUser(socket, userData) {
  const userName = userData.userName;
  userBase.updateUserdb(userName, userData);

  userData = userBase.getUser(userName);
  
  socket.emit("user updated nickname", userData.data);
}
server.listen(8000, () => {
  console.log("listening on *:8000");
});


function searchForFriendName(friendName , socket){
const friendData = userBase.getUser(friendName);
  socket.emit('friend found', friendData?.data);
 
}


function handleChatMessage(chatData) {
  const friendData = userBase.getUser(chatData.friendUserName);

  friendData.connection.emit("friend message", chatData);
}