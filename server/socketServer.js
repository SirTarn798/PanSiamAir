import express from "express";
import { Server } from "socket.io";
import bodyParser from "body-parser";
import cors from "cors";
import prisma from "./lib/db.cjs";
import { configDotenv } from "dotenv";

configDotenv.apply();

const app = express();
const port = 4000;

const expressServer = app.listen(port, () => {
  console.log("Server is running on port 4000...");
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

let cusSockets = {};
let cusIds = {};

let serSockets = {};
let serIds = {};

const io = new Server(expressServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  socket.on("cusRegister", (userId) => {
    cusSockets[userId] = socket.id;
    cusIds[socket.id] = userId;
    console.log(socket.id);
  });

  socket.on("serRegister", (userId) => {
    serSockets[userId] = socket.id;
    serIds[socket.id] = userId;
  });

  socket.on("cusSendMsg", async (data) => {
    for (const [userId, socketId] of Object.entries(serSockets)) {
      io.to(socketId).emit("receiveMsg", data.message);
    }
    await prisma.message.create({
      data: {
        message: data.message,
        sender: data.sender,
        receiver: "services",
      },
    });
  });

  socket.on("serSendMsg", async (data) => {
    if (cusSockets[data.receiver]) {
      io.to(cusSockets[data.receiver]).emit("receiveMsg", data.message);
    }
    for (const [userId, socketId] of Object.entries(serSockets)) {
      io.to(socketId).emit("receiveMsg", data);
    }
    await prisma.message.create({
      data: {
        message: data.message,
        sender: "services",
        receiver: data.receiver,
      },
    });
  });
});

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};
app.use(cors(corsOptions));
