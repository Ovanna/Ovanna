require("dotenv").config();
const express = require("express");
const router = require("./src/routes");
const app = express();
const cors = require("cors");

const port = 5000;
app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));
app.use("/api/v1/", router);

app.listen(port, () => {
  console.log(`Your server running on port ${port}`);
});

// server.listen(port, () => console.log(`Listening on port ${port}!`));
