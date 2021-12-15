// const jwt = require('jsonwebtoken')
// const secretKey = process.env.SECRET_KEY

// const auth = async (req, res, next) => {
//   try {
//     const header = req.header('Authorization')

//     if (!header) {
//       return res.status(401).send({
//         status: 'failed',
//         message: 'Unauthorized'
//       })
//     }

//     const token = header.substring('Bearer '.length)
//     const verify = jwt.verify(token, secretKey, (err, decode) => {
//       if (err) {
//         return res.status(401).send({
//           status: 'failed',
//           message: err.message
//         })
//       }
//       return decode.id
//     })

//     req.idUser = verify

//     next()
//   } catch (error) {
//     console.log(error.message)
//     res.status(500).send({
//       status: 'failed',
//       message: 'server error'
//     })
//   }
// }

// module.exports = auth
const { users, transaction } = require("../../models");

const jwt = require("jsonwebtoken");
const { getUsers } = require("../controllers/user");

exports.auth = (req, res, next) => {
  try {
    let header = req.header("Authorization");

    if (!header) {
      return res.send({
        status: "failed",
        message: "Unauthorized",
      });
    }

    const token = header.replace("Bearer ", "");

    const secretKey = process.env.secretKey;

    const verified = jwt.verify(token, secretKey);

    req.idUser = verified;

    next();
  } catch (error) {
    console.log(error);
    res.status({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.adminAuth = async (req, res, next) => {
  try {
    const findAdmin = await users.findOne({
      where: {
        id: req.idUser.id,
      },
    });

    if (findAdmin.status !== "admin") {
      return res.send({
        status: "failed",
        message: "Forbidden access",
      });
    }

    next();
  } catch (error) {
    console.log(error);
    res.status({
      status: "failed",
      message: "Server Error",
    });
  }
};
exports.transactionAuth = async (req, res, next) => {
  try {
    const { id } = req.params;
    const findAdmin = await users.findOne({
      where: {
        id: req.idUser.id,
      },
    });

    const findTransaction = await transaction.findOne({
      where: {
        userId: req.idUser.id,
        id: id,
      },
    });

    if (findAdmin.status !== "admin" && findTransaction === null) {
      return res.status(403).send({
        status: "failed",
        message: "Forbidden access",
      });
    }

    next();
  } catch (error) {
    console.log(error);
    res.status({
      status: "failed",
      message: "Server Error",
    });
  }
};
