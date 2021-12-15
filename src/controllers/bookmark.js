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
