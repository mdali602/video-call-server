import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { roomHandler } from "./room";

const PORT = 8080;
const app = express();
app.use(cors);
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("user is connected!");
  roomHandler(socket);
  socket.on("disconnect", () => {
    console.log("user is disconnected!");
  });

  // socket.on("disconnect", () => {
  //   console.log("User disconnected");
  //   // Handle user leaving the room and notify others
  //   // const room = socket.room;
  //   // if (room) {
  //   //   socket.to(room).emit("user-left", socket.id);
  //   //   delete rooms[room][socket.id];
  //   // }
  // });

  // // Handle WebRTC signaling
  // socket.on("offer", (offer, targetSocketId) => {
  //   socket.to(targetSocketId).emit("offer", offer);
  // });

  // socket.on("answer", (answer, targetSocketId) => {
  //   socket.to(targetSocketId).emit("answer", answer);
  // });

  // socket.on("ice-candidate", (candidate, targetSocketId) => {
  //   socket.to(targetSocketId).emit("ice-candidate", candidate);
  // });

  // // Handle screen sharing data
  // socket.on("screen-share", (data, targetSocketId) => {
  //   socket.to(targetSocketId).emit("screen-share", data);
  // });

  // // Join a room
  // socket.on("join-room", (room) => {
  //   socket.join(room);

  //   // Save the room information
  //   if (!rooms[room]) {
  //     rooms[room] = {};
  //   }

  //   rooms[room][socket.id] = true;

  //   // Notify others in the room about the new user
  //   socket.to(room).emit("user-joined", socket.id);
  // });

  // // Handle user leaving the room
  // socket.on("leave-room", () => {
  //   const room = socket.room;
  //   if (room) {
  //     socket.to(room).emit("user-left", socket.id);
  //     delete rooms[room][socket.id];
  //   }
  // });
});

server.listen(PORT, () => {
  console.log(`Listening to the ${PORT}`);
});
