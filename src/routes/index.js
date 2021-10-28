const express = require("express");

const router = express.Router();

const { uploadFile } = require('../middleware/uploadFile')

const { register, login, getUser, editUser, deleteUser, getUsers } = require("../controllers/user");

const { addCountry, getCountry, getCountrybyId, editCountry, deleteCountry } = require("../controllers/country");

const { addTrip, getTrip, getTripbyId, editTrip, deleteTrip } = require("../controllers/trip");

const { addTransaction, getTransaction, getTransactionbyId, editTransaction, deleteTransaction } = require("../controllers/transaction");

router.post("/register", register);
router.post("/login", login);
router.get("/users", getUsers);
router.get("/user/:id", getUser);
router.patch("/user/:id", uploadFile('image'), editUser);
router.delete("/user/:id", deleteUser);

router.post("/country", addCountry);
router.get("/countries", getCountry);
router.get("/country/:id", getCountrybyId);
router.patch("/country/:id", editCountry);
router.delete("/country/:id", deleteCountry);

router.post("/trip", uploadFile('image'),addTrip);
router.get("/trips", getTrip);
router.get("/trip/:id", getTripbyId);
router.patch("/trip/:id", uploadFile('image'), editTrip);
router.delete("/trip/:id", deleteTrip);

router.post("/transaction", uploadFile('image'), addTransaction);
router.get("/orders", getTransaction);
router.get("/transaction/:id", getTransactionbyId);
router.patch("/transaction/:id", uploadFile('image'), editTransaction);
router.delete("/transaction/:id", deleteTransaction);

module.exports = router;
