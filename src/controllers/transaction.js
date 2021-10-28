const { trip, country, transaction, users } = require("../../models");

exports.addTransaction = async (req, res) => {
  try {
    let image = null;

    if (req.files.image) {
      image = req.files.image[0].filename;
    }

    const dataUpload = {
      ...req.body,
      attachment: image,
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
    const getTransaction = await transaction.findAll({
      attributes: { exclude: ["createdAt, updatedAt"] },
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
      data: getTransaction,
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

    const getTransaction = await transaction.findOne({
      where: {
        id,
      },
      attributes: { exclude: ["createdAt, updatedAt"] },
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
      data: getTransaction,
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

    if (req.files.image) {
      image = req.files.image[0].filename;
    } else if (!image) {
      const returnImage = await transaction.findOne({
        where: {
          id: getTransaction.id,
        },
      });
      image = returnImage.image;
    }

    const dataUpload = {
      ...data,
      attachment:image,
    };

    await transaction.update(dataUpload, {
      where: {
        id: getTransaction.id,
      },
    });

    const findTransaction = await transaction.findOne({
      where: {
        id: getTransaction.id,
      },
      attributes: {
        exclude: ["createAt", "updateAt"],
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
