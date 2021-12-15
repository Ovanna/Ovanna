const { country } = require("../../models");
const joi = require("joi");

exports.addCountry = async (req, res) => {
  try {
    const { name } = req.body;

    const schema = joi
      .object({
        name: joi.string().required(),
      })
      .validate(req.body);

    if (schema.error) {
      return res.send({
        status: "failed",
        message: schema.error.details[0].message,
      });
    }
    const checkData = await country.findOne({
      where: {
        name: name,
      },

      attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    if (checkData) {
      return res.send({
        status: "Failed",
        message: "Country already created",
      });
    }

    const createCountry = await country.create({ name });

    const checkCountry = await country.findOne({
      where: {
        id: createCountry.id,
      },

      attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    res.send({
      status: "success",
      data: checkCountry,
      message: "Country success created",
    });
  } catch (error) {
    console.log(error);

    res.status({
      status: "failed",
      message: "Server Error",
    });
  }
};
exports.getCountry = async (req, res) => {
  try {
    const getCountry = await country.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    res.send({
      status: "success",
      data: getCountry,
    });
  } catch (error) {
    console.log(error);

    res.status({
      status: "failed",
      message: "Server Error",
    });
  }
};
exports.getCountrybyId = async (req, res) => {
  try {
    const { id } = req.params;

    const getCountry = await country.findOne({
      where: {
        id,
      },
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    res.send({
      status: "success",
      data: getCountry,
    });
  } catch (error) {
    console.log(error);

    res.status({
      status: "failed",
      message: "Server Error",
    });
  }
};
exports.editCountry = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const getCountry = await country.findOne({
      where: {
        id,
      },
    });

    if (!getCountry) {
      return res.send({
        status: "failed",
        message: `Country with id ${id} not created yet`,
      });
    }

    await country.update(data, {
      where: {
        id: getCountry.id,
      },
    });

    const findCountry = await country.findOne({
      where: {
        id: getCountry.id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    res.send({
      status: "success",
      data: findCountry,
    });
  } catch (error) {
    console.log(error);

    res.status({
      status: "failed",
      message: "Server Error",
    });
  }
};
exports.deleteCountry = async (req, res) => {
  try {
    const { id } = req.params;

    const getCountry = await country.findOne({
      where: {
        id,
      },
    });

    if (!getCountry) {
      return res.send({
        status: "failed",
        message: `Country with id ${id} not found`,
      });
    }

    await country.destroy({
      where: {
        id,
      },
    });

    res.send({
      status: "success",
      id: getCountry.id,
      message: `Country with name ${getCountry.name} has deleted`,
    });
  } catch (error) {
    console.log(error);

    res.status({
      status: "failed",
      message: "Server Error",
    });
  }
};
