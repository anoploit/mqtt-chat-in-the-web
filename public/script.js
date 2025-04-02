/*
Coded By Anoploit
1038255
TINNES01
10/03/2025
*/

let client;
let isLoggedIn = false;
function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const url = "ws://localhost:1884";
  const clientCred = "user-" + Math.random().toString(16).substr(2, 3);
  const _topic = "chat";

  document.getElementById("clientid").innerText = clientCred;
  document.getElementById("error-message").style.display = "none";

  const options = {
    clean: true,
    connectTimeout: 300,
    username: username,
    password: password,
    clientId: clientCred,
  };

  client = mqtt.connect(url, options);

  client.on("connect", () => {
    if(isLoggedIn){
      return;
    }
    
    isLoggedIn = true; 
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("chatContainer").style.display = "block";

    const messageBox = document.getElementById("chat");
    const textContent = document.createElement("p");
    const strong = document.createElement("strong");

    strong.innerText = clientCred;
    textContent.append(strong);
    textContent.append(" joined the chat");

    textContent.classList.add("messageleft");
    messageBox.append(textContent);
    messageBox.scrollTop = messageBox.scrollHeight;

    const joinMessage = {
      user: clientCred,
      text: " joined the chat",
    };
    client.publish(_topic, JSON.stringify(joinMessage));

    client.subscribe(_topic, (err) => {
      if (!err) {
        console.log(`Subscribed to ${_topic}`);
      }
    });
  });

    client.on("error", (err) => {
      if (isLoggedIn) return;
      console.error("Connectionerror:", err);
      document.getElementById("error-message").style.display = "block";
    });

  // Listen for incoming messages on the subscribed topic
  client.on("message", (_topic, message) => {
    const messageJson = JSON.parse(message); // Parse the incoming message

    // Create a new element for the message
    const messageBox = document.getElementById("chat");
    const textContent = document.createElement("p");
    const strong = document.createElement("strong");
    strong.innerText = messageJson.user; // Set the message sender's name

    textContent.append(strong);
    textContent.append(" ");
    textContent.append(messageJson.text); // Append the message text

    // Add classes for styling based on the user
    if (messageJson.user == clientCred) {
      textContent.classList.add("messageright"); // Style the message for the current user
    } else {
      textContent.classList.add("messageleft"); // Style the message for other users
    }

    messageBox.append(textContent);
    messageBox.scrollTop = messageBox.scrollHeight; // Scroll to the bottom of the chat
  });
}

// Event listener for the "Enter" key to send a message
document.getElementById("message").addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    event.preventDefault(); // Prevent default action (like adding a new line)
    sendMessage(); // Call the function to send the message
  }
});

function sendMessage() {
  const messageInput = document.getElementById("message");
  const message = messageInput.value.trim();
  if (message) {
    const messageData = {
      user: document.getElementById("clientid").innerText,
      text: message,
    };
    client.publish("chat", JSON.stringify(messageData));
    messageInput.value = "";
  }
}

function disconnect() {
  console.log("Disconnecting...");
  client.end();
  document.getElementById("loginForm").style.display = "block";
  document.getElementById("chatContainer").style.display = "none";
}
