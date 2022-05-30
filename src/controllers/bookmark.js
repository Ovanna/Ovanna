const { bookmark } = require("../../models");

exports.addBookmark = async (req, res) => {
  try {
    const userId = req.idUser.id;
    const { tripId } = req.body;

    const checkBookmark = await bookmark.findOne({
      where: {
        tripId: tripId,
        userId,
      },
    });

    if (checkBookmark) {
      await bookmark.destroy({
        where: {
          id: checkBookmark.id,
        },
      });
      res.status(200).send({
        status: "success",
        message: `remove bookmark successfully with id ${checkBookmark.id}`,
      });
    } else if (!checkBookmark) {
      const dataBookmark = {
        tripId: tripId,
        userId,
      };

      const newData = await bookmark.create(dataBookmark);

      res.status(200).send({
        status: "success",
        message: `add bookmark successfully with id ${newData.id}`,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};
exports.getBookmark = async (req, res) => {
  try {
    const tripId = req.params.id;
    const idUser = req.idUser.id;

    const getBookmark = await bookmark.findOne({
      where: {
        tripId,
        userId: idUser,
      },
    });
    if (!getBookmark) {
      res.send({
        message: `Bookmark with Trip id ${tripId} not found`,
      });
    }
    res.status(200).send({
      status: "success",
      message: `Get Bookmark with Trip id ${getBookmark.tripId}`,
    });
  } catch (error) {
    res.status(500).send({
      status: "failed",
      message: `server error`,
    });
  }
};
exports.getBookmarkbyIdUser = async (req, res) => {
  try {
    const idUser = req.idUser.id;

    const getBookmark = await bookmark.findOne({
      where: {
        userId: idUser,
      },
    });
    if (!getBookmark) {
      res.send({
        message: `Bookmark with user id ${userId} not found`,
      });
    }
    res.status(200).send({
      status: "success",
      message: `Get Bookmark with user id ${getBookmark.userId}`,
    });
  } catch (error) {
    res.status(500).send({
      status: "failed",
      message: `server error`,
    });
  }
};
