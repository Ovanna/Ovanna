const { chat } = require("../../models");

const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

const connectedUser = {};

const socketIo = (io) => {
  io.use((socket, next) => {
    console.log(socket.handshake.auth);
    if (socket.handshake.auth && socket.handshake.auth.token) {
      next();
    } else {
      next(new Error("Not Authorized"));
    }
  });

  io.on("connection", async (socket) => {
    console.log("client connect: ", socket.id);
    // const userId = socket.handshake.query.id;
    // connectedUser[userId] = socket.id;

    // socket.on("load message"),
    //   async (payload) => {
    //     const token = socket.handshake.auth.token;
    //     const tokenKey = process.env.secretKey;
    //     const verified = jwt.verify(token, tokenKey);

    //     const idSender = verified.id;
    //     const idRecipient = payload;

    //     const data = await chat.findAll({
    //       where: {
    //         idSender: {
    //           [Op.or]: [idRecipient, idSender],
    //         },
    //         idRecipient: {
    //           [Op.or]: [idRecipient, idSender],
    //         },
    //       },
    //     });
    //   };
    // socket.on("send message", async (payload) => {
    //   try {
    //     const token = socket.handshake.auth.token;
    //     const tokenKey = process.env.secretKey;
    //     const verified = jwt.verify(token, tokenKey);

    //     const idSender = verified.id;

    //     const { message, idRecipient } = payload;

    //     await chat.create({
    //       message,
    //       idRecipient,
    //       idSender,
    //     });

    //     io.to(socket.id)
    //       .to(connectedUser[idRecipient])
    //       .emit("new message", idRecipient);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // });

    socket.on("disconnect", async () => {
      // delete connectedUser[userId];
      console.log("client disconnect");
    });
  });
};

module.exports = socketIo;
