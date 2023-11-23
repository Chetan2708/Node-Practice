const socket = io();
let Name;
let textarea = document.querySelector("#textarea");
let messageArea = document.querySelector(".message__area");
let sendButton = document.querySelector("#sendButton");
let usernameContainer = document.getElementById("usernameContainer");
const acceptedRequests = new Set();
const deletedRequests = new Set();
do {
  Name = prompt("Please enter your name: ");
} while (!Name);

sendButton.addEventListener("click", () => {
  sendMessage(textarea.value);
});

textarea.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    sendMessage(e.target.value);
  }
});

// Add a button click event listener for the "Request" button
document.querySelector("#requestButton").addEventListener("click", () => {
  // Add input for team size
  let teamSizeInput = document.createElement("input");
  teamSizeInput.type = "number";
  teamSizeInput.placeholder = "Enter team size";
  teamSizeInput.addEventListener("blur", () => {
    // Get the team size when the input loses focus
    let teamSize = teamSizeInput.value;
    sendRequest(teamSize);
    // Remove the input after sending the request
    usernameContainer.removeChild(teamSizeInput);
  });

  usernameContainer.appendChild(teamSizeInput);
});

// Handle response buttons
messageArea.addEventListener("click", (e) => {
    if (e.target.classList.contains("acceptButton")) {
        const requestId = e.target.dataset.requestId;

        // Check if the request has already been accepted
        if (!acceptedRequests.has(requestId)) {
            // Mark the request as accepted
            acceptedRequests.add(requestId);

            // Send the response to the server
            sendResponse("accepted", requestId);

            // Disable the "Accept" button to prevent further clicks
            e.target.disabled = true;
        }
    } else if (e.target.classList.contains("declineButton")) {
        const requestId = e.target.dataset.requestId

         if (!deletedRequests.has(requestId)) {
            // Mark the request as accepted
            deletedRequests.add(requestId);

            // Send the response to the server
            sendResponse("deleted", requestId);

            // Disable the "Accept" button to prevent further clicks
            e.target.disabled = true;
        }
    }
});
function sendMessage(message) {
  let msg = {
    user: Name,
    message: message.trim(),
    type: "chat", // Regular chat message type
  };
  appendMessage(msg, "outgoing");
  textarea.value = "";
  scrollToBottom();
  socket.emit("message", msg);
}

function sendRequest(teamSize) {
  let requestMsg = {
    user: Name,
    type: "request",
    size: teamSize,
  };
  socket.emit("message", requestMsg);
}

function sendResponse(action, requestId) {
  let responseMsg = {
    action,
    requestId,
    teamName: Name,
  };
  socket.emit("response", responseMsg);
}

function appendMessage(msg, type) {
  let mainDiv = document.createElement("div");
  let className = type;
  mainDiv.classList.add(className, "message");

  let markup;
  if (msg.type === "request") {
    markup = `
            <h4>${msg.user}</h4>
            <p>${msg.message}</p>
            <button class="acceptButton" data-request-id="${msg.requestId}">Accept</button>
            <button class="declineButton" data-request-id="${msg.requestId}">Decline</button>
        `;
  } else {
    markup = `
            <h4>${msg.user}</h4>
            <p>${msg.message}</p>
        `;
  }

  mainDiv.innerHTML = markup;
  messageArea.appendChild(mainDiv);
}

socket.on("message", (msg) => {
  appendMessage(msg, "incoming");
  scrollToBottom();
});

function scrollToBottom() {
  messageArea.scrollTop = messageArea.scrollHeight;
}
