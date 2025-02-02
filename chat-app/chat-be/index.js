require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const frontendOrigin = process.env.NODE_ENV === 'production'
    ? "https://your-frontend-url.com"  // Replace with your production URL
    : "http://localhost:5173";  // Localhost during development

app.use(cors({
    origin: frontendOrigin,  // Dynamic CORS origin based on environment
    methods: ["POST", "GET", "PUT", "DELETE"]
}));

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: frontendOrigin,  // Dynamic CORS configuration
        methods: ["POST", "GET", "PUT", "DELETE"]
    },
});

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);
    socket.on("send-message", (message) => {
        try {
            console.log(`Message received from ${socket.id}:`, message);
            io.emit("received-message", message); // Broadcast to all clients
        } catch (error) {
            console.error("Error while handling 'send-message':", error);
        }
    });

    socket.on("disconnect", () => console.log("User disconnected"))
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
    console.error("Error starting server:", err);
});
