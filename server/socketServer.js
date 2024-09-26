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
  });

  socket.on("serRegister", (userId) => {
    serSockets[userId] = socket.id;
    serIds[socket.id] = userId;
  });

  socket.on("cusSendMsg", async (data) => {
    for (const [userId, socketId] of Object.entries(serSockets)) {
      io.to(socketId).emit("receiveMsg", data);
    }
    await prisma.mESSAGE.create({
      data: {
        M_Message: data.M_Message ? data.M_Message : null,
        M_Image: data.M_Image ? data.M_Image : null,
        M_Sender: data.M_Sender,
        M_Receiver: "services",
        M_DateTime: data.M_DateTime,
      },
    });
  });

  socket.on("serSendMsg", async (data) => {
    if (cusSockets[data.receiver]) {
      io.to(cusSockets[data.receiver]).emit("receiveMsg", data);
    }
    for (const [userId, socketId] of Object.entries(serSockets)) {
      io.to(socketId).emit("receiveMsg", data);
    }
    await prisma.mESSAGE.create({
      data: {
        M_Message: data.M_Message ? data.M_Message : null,
        M_Image: data.M_Image ? data.M_Image : null,
        M_Sender: "services",
        M_Receiver: data.M_Receiver,
        M_DateTime: data.M_DateTime,
      },
    });
  });

  socket.on("disconnect", () => {
    const userId = cusIds[socket.id] || serIds[socket.id];
    if (cusIds[socket.id]) {
      delete cusSockets[userId];
      delete cusIds[socket.id];
    } else if (serIds[socket.id]) {
      delete serSockets[userId];
      delete serIds[socket.id];
    }
  });
});

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};
app.use(cors(corsOptions));
