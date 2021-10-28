const joi = require("joi");
const { users } = require("../../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = req.body;

    const schema = joi
      .object({
        fullName: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().min(8).required(),
        gender: joi.string().allow("").optional(),
        phone: joi.string().allow("").optional(),
        address: joi.string().allow("").optional(),
      })
      .validate(data);

    if (schema.error) {
      return res.send({
        status: "failed",
        message: schema.error.details[0].message,
      });
    }

    const checkEmail = await users.findOne({
      where: {
        email,
      },
    });

    if (checkEmail) {
      return res.send({
        status: "Failed",
        message: "Email Already Registered",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const createUser = await users.create({
      ...data,
      password: hashPassword,
    });

    const secretKey = process.env.secretKey;

    const token = jwt.sign(
      {
        id: createUser.id,
      },
      secretKey
    );

    const responseData = {
      email: email,
      token: token,
    };

    res.send({
      status: "success",
      data: responseData,
    });
  } catch (error) {
    console.log(error);

    res.status({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const schema = joi
      .object({
        email: joi.string().email().required(),
        password: joi.string().min(8).required(),
      })
      .validate(req.body);

    if (schema.error) {
      return res.send({
        status: "failed",
        message: schema.error.details[0].message,
      });
    }

    const checkEmail = await users.findOne({
      where: {
        email,
      },
    });

    if (!checkEmail) {
      return res.send({
        status: "failed",
        message: "Email or password wrong",
      });
    }

    const hashPassword = await bcrypt.compare(password, checkEmail.password);

    if (!checkEmail.email) {
      return res.send({
        status: "failed",
        message: "Email or password wrong",
      });
    }

    if (!hashPassword) {
      return res.send({
        status: "failed",
        message: "Email or password wrong",
      });
    }

    const secretKey = process.env.secretKey;

    const token = jwt.sign(
      {
        id: checkEmail.id,
      },
      secretKey
    );

    const responseData = {
      email: email,
      token: token,
    };

    res.send({
      status: "success",
      data: responseData,
    });
  } catch (error) {
    console.log(error);

    res.status({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const getUser = await users.findAll({
      attributes: { exclude: ["createdAt", "updatedAt", "password"] },
    });

    res.send({
      status: "success",
      data: getUser,
    });
  } catch (error) {
    console.log(error);

    res.status({
      status: "failed",
      message: "Server Error",
    });
  }
};
exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;

    const getUser = await users.findOne({
      where: { id: id },
      attributes: { exclude: ["createdAt", "updatedAt", "password"] },
    });

    res.send({
      status: "success",
      data: getUser,
    });
  } catch (error) {
    console.log(error);

    res.status({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.editUser = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const { password } = req.body;
    let image = null;

    const getUser = await users.findOne({
      where: {
        id,
      },
    });

    if (!getUser) {
      return res.send({
        status: "failed",
        message: `Account with id ${id} not found`,
      });
    }

    if (req.files.image) {
      image = req.files.image[0].filename;
    } else if (!image) {
      const returnImage = await users.findOne({
        where: {
          id: getUser.id,
        },
      });
      image = returnImage.image;
    }

    const dataUpdate = [];
    if (data.password !== undefined) {
      const hashPassword = await bcrypt.hash(password, 10);
      dataUpdate.push({
        ...data,
        password: hashPassword,
        image,
      });
    }

    if (data.password !== undefined) {
      await users.update(...dataUpdate, {
        where: {
          id: getUser.id,
        },
      });
    }

    if (data.password === undefined) {
      await users.update(data, {
        where: {
          id: getUser.id,
        },
      });
    }

    const findUser = await users.findOne({
      where: {
        id: getUser.id,
      },
      attributes: {
        exclude: ["createAt", "updateAt"],
      },
    });

    res.send({
      status: "success",
      data: findUser,
    });
  } catch (error) {
    console.log(error);

    res.status({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const getUser = await users.findOne({
      where: {
        id,
      },
    });

    if (!getUser) {
      return res.send({
        status: "failed",
        message: `User with id ${id} not found`,
      });
    }

    await users.destroy({
      where: {
        id,
      },
    });

    res.send({
      status: "success",
      id: getUser.id,
      message: `user with email ${getUser.email} has deleted`,
    });
  } catch (error) {
    console.log(error);

    res.status({
      status: "failed",
      message: "Server Error",
    });
  }
};
