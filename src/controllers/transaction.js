const { trip, country, transaction, users, order } = require("../../models");

exports.addTransaction = async (req, res) => {
  try {
    const { id } = req.idUser;

    let image = null;
    if (req.files.image) {
      image = req.files.image[0].filename;
    }

    let tripId = null;
    if (req.body.tripId) {
      const findTrip = await trip.findOne({
        where: {
          id: req.body.tripId,
        },
      });
      if (req.body.tripId === "") {
        tripId = null;
      } else if (!findTrip && req.body.tripId !== "") {
        return res.send({
          message: `trip with id ${req.body.tripId} not found`,
        });
      } else {
        tripId = req.body.tripId;
      }
    }

    const dataUpload = {
      ...req.body,
      attachment: image,
      tripId,
      userId: id,
    };

    const createTransaction = await transaction.create(dataUpload);

    const checkTransaction = await transaction.findOne({
      where: {
        id: createTransaction.id,
      },
      include: [
        {
          model: users,
          as: "user",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        },
        {
          model: trip,
          as: "trip",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
          include: {
            model: country,
            as: "country",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    res.send({
      status: "success",
      data: checkTransaction,
    });
  } catch (error) {
    console.log(error);

    res.status({
      status: "failed",
      message: "Server Error",
    });
  }
};
exports.getTransaction = async (req, res) => {
  try {
    let getTransaction = await transaction.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        {
          model: users,
          as: "user",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        },
        {
          model: trip,
          as: "trip",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
          include: {
            model: country,
            as: "country",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
        },
      ],
    });

    // const path = "http://localhost:5000/uploads/";

    // let attachment = JSON.parse(JSON.stringify(getTransaction));

    res.send({
      status: "success",
      data: getTransaction,
      // attachment: attachment.map((x) => path + x.attachment)
    });
  } catch (error) {
    console.log(error);

    res.status({
      status: "failed",
      message: "Server Error",
    });
  }
};
exports.getTransactionbyId = async (req, res) => {
  try {
    const { id } = req.params;

    let getTransaction = await transaction.findOne({
      where: {
        id,
      },
      attributes: { exclude: ["createdAt, updatedAt"] },
      include: [
        {
          model: users,
          as: "user",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        },
        {
          model: trip,
          as: "trip",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
          include: {
            model: country,
            as: "country",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
        },
      ],
    });
    const path = "http://localhost:5000/uploads/";

    getTransaction = JSON.parse(JSON.stringify(getTransaction));

    const newData = {
      ...getTransaction,
      attachment: path + getTransaction.attachment,
    };

    res.send({
      status: "success",
      data: newData,
    });
  } catch (error) {
    console.log(error);

    res.status({
      status: "failed",
      message: "Server Error",
    });
  }
};
exports.getTransactionbyCreated = async (req, res) => {
  try {
    const { id } = req.idUser;

    let getTransaction = await transaction.findAll({
      where: {
        userId: id,
      },
      attributes: { exclude: ["createdAt, updatedAt"] },
      include: [
        {
          model: users,
          as: "user",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        },
        {
          model: trip,
          as: "trip",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
          include: {
            model: country,
            as: "country",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
        },
      ],
    });
    const path = "http://localhost:5000/uploads/";

    let attachment = JSON.parse(JSON.stringify(getTransaction));

    res.send({
      status: "success",
      data: getTransaction,
      attachment: attachment.map((x) => path + x.attachment),
    });
  } catch (error) {
    console.log(error);

    res.status({
      status: "failed",
      message: "Server Error",
    });
  }
};
exports.editTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    let image = null;

    const getTransaction = await transaction.findOne({
      where: {
        id,
      },
    });

    if (!getTransaction) {
      return res.send({
        status: "failed",
        message: "Transaction not created yet",
      });
    }

    if (!image && !req.files) {
      const returnImage = await transaction.findOne({
        where: {
          id: getTransaction.id,
        },
      });
      image = returnImage.image;
    } else if (req.files.image !== undefined) {
      image = req.files.image[0].filename;
    }

    const dataUpload = {
      ...data,
      attachment: image,
    };

    await transaction.update(dataUpload, {
      where: {
        id: getTransaction.id,
      },
    });

    const findTransactionStatus = await transaction.findAll({
      where: {
        tripId: getTransaction.tripId,
        status: "Approve",
      },
    });
    console.log(findTransactionStatus.length === 0);
    if (findTransactionStatus.length !== 0) {
      const ToTotal = findTransactionStatus.map((x) => x.counterQty);

      const reducer = (accumulator, item) => {
        return accumulator + item;
      };
      const CheckTotal = ToTotal.reduce(reducer, 0);

      const totalCounter = {
        counterQty: CheckTotal,
      };

      await trip.update(totalCounter, {
        where: {
          id: getTransaction.tripId,
        },
      });
    } else if (findTransactionStatus.length === 0) {
      const totalCounter = {
        counterQty: null,
      };

      await trip.update(totalCounter, {
        where: {
          id: getTransaction.tripId,
        },
      });
    }
    const findTransaction = await transaction.findOne({
      where: {
        id: getTransaction.id,
      },
      attributes: {
        exclude: ["createAt", "updateAt", "password"],
      },
      include: [
        {
          model: users,
          as: "user",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
        {
          model: trip,
          as: "trip",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
          include: {
            model: country,
            as: "country",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
        },
      ],
    });

    res.send({
      status: "success",
      data: findTransaction,
    });
  } catch (error) {
    console.log(error);

    res.status({
      status: "failed",
      message: "Server Error",
    });
  }
};
exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const getTransaction = await transaction.findOne({
      where: {
        id,
      },
    });

    if (!getTransaction) {
      return res.send({
        status: "failed",
        message: `Transaction with id ${id} not created`,
      });
    }

    await transaction.destroy({
      where: {
        id,
      },
    });

    res.send({
      status: "success",
      id: getTransaction.id,
      message: `Transaction with id ${getTransaction.id} has deleted`,
    });
  } catch (error) {
    console.log(error);

    res.status({
      status: "failed",
      message: "Server Error",
    });
  }
};