var socket = io();

var UsernameNode = document.getElementById("userName");
var SubButtonNode = document.getElementById("submitUserName");
var userNameLabel = document.getElementById("userNickNameLabel");
var searchFriendName = document.getElementById("searchFriend");
var searchNode = document.getElementById("search");
var FriendNameLabel = document.getElementById("friendName");

SubButtonNode.addEventListener("click", () => {
  const userName = UsernameNode.value;

  socket.emit("connect user", userName); //giving username 
});

searchNode.addEventListener("click", () => {
  const friendName = searchFriendName.value 
  socket.emit("search friend" , friendName)
})


socket.on("disconnect", () => {
  console.log("user disconnected");
});
socket.on("connect", () => {
  console.log("user connected");
});

socket.on("user updated", function (userData) {
  if (!userData.nickname) {
    const nickname = prompt("Enter your nickname");
    if (nickname) {
      socket.emit("update user", {
        nickname: nickname,
        userName: userData.userName,
      });
    }
  }
  else {
    user = userData
    userNameLabel.innerText = userData.nickname;
  }
});

socket.on("user updated nickname", function (userData) {
  user = userData
  userNameLabel.innerText = userData.nickname;
});

socket.on("friend found" , function (friendData) {
  if(friendData){
    FriendNameLabel.innerText = friendData.nickname;
    startChat(friendData)
  }else{
    FriendNameLabel.innerText = 'You have no friend'
  }
}
)

function startChat(friendData){
  const chatBoxNode = document.getElementById("chatBox");

  chatBoxNode.innerHTML = "";

  const chatButtonNode = document.createElement("button");
  chatButtonNode.innerText = "chat with " + friendData.nickname;
  chatButtonNode.innerText.style = 'red'; 
  chatButtonNode.id = "chatButton";

  chatBoxNode.appendChild(chatButtonNode);
  


  //Add event listener on chat button

  chatButtonNode.addEventListener("click", ()=>{
    const chatNode = document.createElement("div");
    chatNode.style.position = "fixed";
    chatNode.style.bottom = "0px";
    chatNode.style.right = "0px";
    chatNode.style.width = "300px";
    chatNode.style.height = "300px";
    chatNode.style.backgroundColor = "white";
    chatNode.style.border = "1px solid black";
    chatNode.style.display = "flex";
    chatNode.style.flexDirection = "column";

    const chatHeaderNode = document.createElement("div");
    chatHeaderNode.style.height = "50px";
    chatHeaderNode.style.backgroundColor = "grey";
    chatHeaderNode.style.display = "flex";
    chatHeaderNode.style.justifyContent = "space-between";
    chatHeaderNode.style.alignItems = "center";

    const chatHeaderLabelNode = document.createElement("label");
    chatHeaderLabelNode.innerText = friendData.nickName;

    const chatHeaderCloseButtonNode = document.createElement("button");
    chatHeaderCloseButtonNode.innerText = "X";
    
    chatHeaderNode.appendChild(chatHeaderLabelNode);
    chatHeaderNode.appendChild(chatHeaderCloseButtonNode);

    const chatBodyNode = document.createElement("div");
    chatBodyNode.style.flexGrow = "1";
    chatBodyNode.style.overflowY = "scroll";

    const chatFooterNode = document.createElement("div");
    chatFooterNode.style.height = "50px";
    chatFooterNode.style.backgroundColor = "grey";
    chatFooterNode.style.display = "flex";
    chatFooterNode.style.justifyContent = "space-between";
    chatFooterNode.style.alignItems = "center";

    const chatFooterInputNode = document.createElement("input");
    chatFooterInputNode.style.flexGrow = "1";

    const chatFooterSendButtonNode = document.createElement("button");
    chatFooterSendButtonNode.innerText = "Send";

    chatFooterNode.appendChild(chatFooterInputNode);
    chatFooterNode.appendChild(chatFooterSendButtonNode);

    chatNode.appendChild(chatHeaderNode);
    chatNode.appendChild(chatBodyNode);
    chatNode.appendChild(chatFooterNode);

    document.body.appendChild(chatNode);

    // send message
    chatFooterSendButtonNode.addEventListener("click", function () {
      const msg = chatFooterInputNode.value;
      debugger;

      socket.emit("chat message", {
        msg: msg,
        friendUserName: friendData.userName,
        sentBy: user,
      });

      chatFooterInputNode.value = "";
    });
  });
}

// handle incoming chat

const chatList = {};

let body;
socket.on("friend message", function (chatData) {
  if (!chatList[chatData.sentBy.userName]) {
    chatList[chatData.sentBy.userName] = true;

    // create a chatbox like hangout and append into body

    const chatNode = document.createElement("div");
    chatNode.style.position = "fixed";
    chatNode.style.bottom = "0px";
    chatNode.style.right = "0px";
    chatNode.style.width = "300px";
    chatNode.style.height = "300px";
    chatNode.style.backgroundColor = "white";
    chatNode.style.border = "1px solid black";
    chatNode.style.display = "flex";
    chatNode.style.flexDirection = "column";

    const chatHeaderNode = document.createElement("div");
    chatHeaderNode.style.height = "50px";
    chatHeaderNode.style.backgroundColor = "grey";
    chatHeaderNode.style.display = "flex";
    chatHeaderNode.style.justifyContent = "space-between";
    chatHeaderNode.style.alignItems = "center";

    const chatHeaderLabelNode = document.createElement("label");
    chatHeaderLabelNode.innerText = chatData.sentBy.nickName;

    const chatHeaderCloseButtonNode = document.createElement("button");
    chatHeaderCloseButtonNode.innerText = "X";

    chatHeaderNode.appendChild(chatHeaderLabelNode);
    chatHeaderNode.appendChild(chatHeaderCloseButtonNode);

    const chatBodyNode = document.createElement("div");
    chatBodyNode.style.flexGrow = "1";
    chatBodyNode.style.overflowY = "scroll";

    const chatFooterNode = document.createElement("div");
    chatFooterNode.style.height = "50px";
    chatFooterNode.style.backgroundColor = "grey";
    chatFooterNode.style.display = "flex";
    chatFooterNode.style.justifyContent = "space-between";
    chatFooterNode.style.alignItems = "center";

    const chatFooterInputNode = document.createElement("input");
    chatFooterInputNode.style.flexGrow = "1";

    const chatFooterSendButtonNode = document.createElement("button");
    chatFooterSendButtonNode.innerText = "Send";

    chatFooterNode.appendChild(chatFooterInputNode);
    chatFooterNode.appendChild(chatFooterSendButtonNode);

    chatNode.appendChild(chatHeaderNode);
    chatNode.appendChild(chatBodyNode);
    chatNode.appendChild(chatFooterNode);

    document.body.appendChild(chatNode);

    body = chatBodyNode;
  }
  // create a incoming chat message and append into chat body

  const chatMessageNode = document.createElement("div");
  chatMessageNode.style.display = "flex";
  chatMessageNode.style.justifyContent = "flex-start";
  chatMessageNode.style.alignItems = "center";
  chatMessageNode.style.margin = "10px";

  const chatMessageLabelNode = document.createElement("label");
  chatMessageLabelNode.innerText = chatData.msg;

  chatMessageNode.appendChild(chatMessageLabelNode);

  body.appendChild(chatMessageNode);
});