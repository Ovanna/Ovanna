const { trip, country } = require("../../models");

exports.addTrip = async (req, res) => {
  try {
    let image = null;

    if (req.files.image) {
      image = JSON.stringify(req.files.image.map((x) => x.filename));
    }

    let countryId = null;
    console.log(req.body.countryId === "");
    if (req.body.countryId) {
      const findCountry = await country.findOne({
        where: {
          id: req.body.countryId,
        },
      });
      if (!findCountry && req.body.countryId !== "") {
        return res.send({
          message: `country wih id ${req.body.countryId} not found`,
        });
      } else {
        countryId = req.body.countryId;
      }
    }

    const dataUpload = {
      ...req.body,
      image,
      countryId,
    };

    const createTrip = await trip.create(dataUpload);

    const checkTrip = await trip.findOne({
      where: {
        id: createTrip.id,
      },
      include: {
        model: country,
        as: "country",
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    
    res.send({
      status: "success",
      data: checkTrip,
      message:'Trip success created'
    });
  } catch (error) {
    console.log(error);

    res.status({
      status: "failed",
      message: "Server Error",
    });
  }
};
exports.getTrip = async (req, res) => {
  try {
    const getCountry = await trip.findAll({
      attributes: { exclude: ["createdAt, updatedAt"] },
      include: {
        model: country,
        as: "country",
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
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
exports.getTripbyId = async (req, res) => {
  try {
    const { id } = req.params;

    let getTrip = await trip.findOne({
      where: {
        id,
      },
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
    });
    const path = 'http://localhost:5000/uploads/'
  
   
    getTrip = JSON.parse(JSON.stringify(getTrip))
   
    const newData = {
      ...getTrip,
      image: JSON.parse(getTrip.image).map((x)=>  
      path + x)
    }

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

exports.editTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    let image = null;

    const getTrip = await trip.findOne({
      where: {
        id,
      },
    });

    if (!getTrip) {
      return res.send({
        status: "failed",
        message: "Trip not created yet",
      });
    }

    if (req.files.image) {
      image = req.files.image[0].filename;
    } else if (!image) {
      const returnImage = await trip.findOne({
        where: {
          id: getTrip.id,
        },
      });
      image = returnImage.image;
    }

    const dataUpload = {
      ...data,
      image,
    };

    await trip.update(dataUpload, {
      where: {
        id: getTrip.id,
      },
    });

    const findTrip = await trip.findOne({
      where: {
        id: getTrip.id,
      },
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
    });

    res.send({
      status: "success",
      data: findTrip,
    });
  } catch (error) {
    console.log(error);

    res.status({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.deleteTrip = async (req, res) => {
  try {
    const { id } = req.params;

    const getTrip = await trip.findOne({
      where: {
        id,
      },
    });

    if (!getTrip) {
      return res.send({
        status: "failed",
        message: `Trip with id ${id} not found`,
      });
    }

    await trip.destroy({
      where: {
        id,
      },
    });

    res.send({
      status: "success",
      id: getTrip.id,
      message: `Trip with id ${getTrip.id} has deleted`,
    });
  } catch (error) {
    console.log(error);

    res.status({
      status: "failed",
      message: "Server Error",
    });
  }
};
