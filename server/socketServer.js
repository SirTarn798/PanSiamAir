import express from "express";
import { Server } from "socket.io";
import bodyParser from "body-parser";
import cors from "cors";
import { configDotenv } from "dotenv";
import pg from "pg"

configDotenv.apply();

const app = express();
const port = 4000;

const expressServer = app.listen(port, () => {
  console.log("Server is running on port 4000...");
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// CORS configuration
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};
app.use(cors(corsOptions));

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "PANSIAM",
  password: process.env.DB_PASSWORD,
  port: 5432,
});
db.connect();

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
    try {
      // Send message to all service sockets
      for (const socketId of Object.values(serSockets)) {
        io.to(socketId).emit("receiveMsg", data);
      }
      
      // SQL Query to insert message
      const insertQuery = `
        INSERT INTO "MESSAGE" ("M_Message", "M_Image", "M_Sender", "M_Receiver", "M_DateTime") 
        VALUES ($1, $2, $3, $4, $5)
      `;
      await db.query(insertQuery, [
        data.M_Message || null,
        data.M_Image || null,
        data.M_Sender,
        "services",
        data.M_DateTime,
      ]);
    } catch (error) {
      console.error("Error sending customer message:", error);
    }
  });

  socket.on("serSendMsg", async (data) => {
    try {
      // Send message to customer socket
      if (cusSockets[data.M_Receiver]) {
        io.to(cusSockets[data.M_Receiver]).emit("receiveMsg", data);
      }
      
      // Send message to all customer sockets
      for (const socketId of Object.values(serSockets)) {
        io.to(socketId).emit("receiveMsg", data);
      }

      // SQL Query to insert message
      const insertQuery = `
        INSERT INTO "MESSAGE" ("M_Message", "M_Image", "M_Sender", "M_Receiver", "M_DateTime") 
        VALUES ($1, $2, $3, $4, $5)
      `;
      await db.query(insertQuery, [
        data.M_Message || null,
        data.M_Image || null,
        "services",
        data.M_Receiver,
        data.M_DateTime,
      ]);
    } catch (error) {
      console.error("Error sending service message:", error);
    }
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
