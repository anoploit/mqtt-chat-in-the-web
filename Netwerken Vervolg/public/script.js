/*
Coded By Mosaab Saddik
1038255
TINNES01
10/03/2025
*/

const url = "wss://localhost:1884"; // WebSocket server URL
const clientCred = "user-" + Math.random().toString(16).substr(2, 3); // Generate a random user ID for the client
const _topic = "chat"; // Topic for the chat messages, can be customized

// Display the client ID in the HTML element with id "clientid"
document.getElementById("clientid").innerText = clientCred;

const options = {
  clean: true, // Ensures that no session data is retained
  connectTimeout: 4000, // Timeout for the connection
  clientId: clientCred, // Unique client ID
};

const client = mqtt.connect(url, options); // Create MQTT client and connect to the broker

client.on("connect", () => {
  // Show that the user has joined the chat by appending a message to the chat box
  const messageBox = document.getElementById("chat");
  const textContent = document.createElement("p");
  const strong = document.createElement("strong");

  strong.innerText = clientCred; // Set the client's name in bold
  textContent.append(strong);
  textContent.append(" joined the chat"); // Text indicating that the user joined

  textContent.classList.add("messageleft"); // Style for the message
  messageBox.append(textContent);
  messageBox.scrollTop = messageBox.scrollHeight; // Scroll to the bottom of the chat

  // Publish a message to the chat indicating that the user joined
  const joinMessage = {
    user: clientCred,
    text: " joined the chat",
  };
  client.publish(_topic, JSON.stringify(joinMessage));

  // Subscribe to the topic so the client can receive messages
  client.subscribe(_topic, (err) => {
    if (!err) {
      console.log(`Subscribed to ${_topic}`);
    }
  });
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

// Event listener for the "Enter" key to send a message
document.getElementById("message").addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    event.preventDefault(); // Prevent default action (like adding a new line)
    sendMessage(); // Call the function to send the message
  }
});

// Function to send a message
function sendMessage() {
  const messageInput = document.getElementById("message");
  const message = messageInput.value.trim(); // Trim any extra spaces
  if (message) {
    const messageData = {
      user: clientCred, // Send the current user's name
      text: message, // Send the message text
    };

    // Publish the message to the topic
    client.publish(_topic, JSON.stringify(messageData));
    messageInput.value = ""; // Clear the input field after sending the message
  }
}

// Function to disconnect the client from the MQTT broker
function disconnect() {
  console.log("Disconnecting...");
  client.end(); // Disconnect from the broker
}
