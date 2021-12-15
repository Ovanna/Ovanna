require("dotenv").config();
const express = require("express");
const router = require("./src/routes");
const app = express();
const cors = require("cors");
// import this
const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

require("./src/socket")(io);
const port = 5000;
app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));
app.use("/api/v1/", router);

server.listen(port, () => {
  console.log(`Your server running on port ${port}`);
});

// server.listen(port, () => console.log(`Listening on port ${port}!`));
