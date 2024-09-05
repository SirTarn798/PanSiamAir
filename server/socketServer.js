import express from "express";
import { Server } from "socket.io";
import bodyParser from "body-parser";
import cors from "cors";
import prisma from "./lib/db.cjs";

const app = express();
const port = 4000;

const expressServer = app.listen(port, () => {
  console.log("Server is running on port 4000...");
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

let userSockets = {};
let userIds = {};

const io = new Server(expressServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  socket.on("register", (userId) => {
    userSockets[userId] = socket.id;
    userIds[socket.id] = userId;
  });

  socket.on("sendMsg", async (data) => {
    if (userSockets[data.receiver]) {
      io.to(userSockets[data.receiver]).emit("receiveMsg", data.message);
    }
    const sender = userIds[socket.id];
    await prisma.message.create({
      data: {
        message: data.message,
        sender,
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
