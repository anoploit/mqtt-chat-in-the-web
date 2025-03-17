# MQTT Chat Web Application

This project implements a simple chat application using WebSockets and MQTT, where users can send and receive messages in real-time. The application uses **Eclipse Mosquitto** as the MQTT broker and **NGINX** for serving the web interface.

## Requirements

- Docker Desktop
- SSL Keys -> OpenSSL

## Setup

1. **Download the right version of Docker Desktop** for your OS following the following url:
   ```https://www.docker.com/products/docker-desktop/```

2. **Clone the repository** or download the project files to your local machine.

   ```bash
   git clone https://github.com/anoploit/mqtt-chat-in-the-web.git
   ```

3. **Install OpenSSL** and add the bin to your environment (for windows users)
   ```https://slproweb.com/products/Win32OpenSSL.html``` 

4. **Generate SSL certificates** for secure communication (optional because they're already generated).
   
   ```bash
   openssl req -x509 -newkey rsa:2048 -keyout mosquitto.key -out mosquitto.crt -days 365
   ``` 

5. **Make sure you have your certificates** (`server.crt` and `server.key`) located in the `mosquitto/keys/` directory of the project. You can manually copy them inside the repo.

6. **Add the certificate to your browser**:
   
   If you're using self-signed certificates, you'll need to add the certificate to your browser to avoid security warnings.
   
   - For **Google Chrome**:
     1. Open the browser and go to `chrome://settings/certificates`
     2. Click on "Import" and select the `server.crt` file.
     3. Ensure that the certificate is trusted for SSL connections.
   
   - For **Mozilla Firefox**:
     1. Go to the Firefox settings and search for `certificates`.
     2. Click on "View Certificates" and import the `server.crt` file.
     3. Mark the certificate as trusted.

7. **Start the application** using Docker Compose:

   ```bash
   docker-compose up
   ```

   This will start both the **web server (NGINX)** and **MQTT broker (Mosquitto)** in separate containers.

8. Open your browser and navigate to either urls below. You should see the chat interface.
   - `localhost:80` -> **http** redirect to **https**
   - `localhost:443` -> **https port** (immediate connection)

## How it works

- The **web interface** (HTML, CSS, and JavaScript) is served through NGINX.
- The **chat messages** are sent and received through the MQTT broker using WebSockets on port 1884.
- The **messages** are published to a topic named `chat` (*can be changed based on your input*) and are visible to all connected clients.

## Features

- **Real-time chat**: Messages appear instantly in the chat window.
- **Join notification**: Users who connect to the chat will have their username displayed, notifying others that they joined.
- **Secure communication**: The chat is served over HTTPS using self-signed certificates.

## Troubleshooting

- **Connection issues**: If the chat interface does not load, check your browser for certificate warnings and ensure the `server.crt` is trusted.
- **MQTT connection**: If the MQTT client fails to connect, ensure the Mosquitto broker is running correctly and is reachable on port 1884.
- **MQTT connection**: If there is no solution, try to troubleshoot the problem by ensuring the Mosquitto broker is reachable on port 1883 without any websockets, by changing the url code block in `public/script.js`

## License

This project is open-source and distributed under the MIT License.

---
