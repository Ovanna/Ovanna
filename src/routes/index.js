const express = require("express");

const router = express.Router();

const { checkAuth } = require("../controllers/auth");
const { auth, adminAuth, transactionAuth } = require("../middleware/auth");

const { uploadFile } = require("../middleware/uploadFile");

const {
  register,
  login,
  getUser,
  getUserById,
  editUser,
  deleteUser,
  getUsers,
} = require("../controllers/user");

const {
  addCountry,
  getCountry,
  getCountrybyId,
  editCountry,
  deleteCountry,
} = require("../controllers/country");

const {
  addTrip,
  getTrip,
  getTripbyId,
  editTrip,
  deleteTrip,
} = require("../controllers/trip");

const {
  addTransaction,
  getTransaction,
  getTransactionbyId,
  editTransaction,
  deleteTransaction,
  getTransactionbyCreated,
} = require("../controllers/transaction");

const {
  addBookmark,
  getBookmark,
  getBookmarkbyIdUser,
} = require("../controllers/bookmark");

router.get("/authorization", auth, checkAuth);

router.post("/register", register);
router.post("/login", login);
router.get("/users", getUsers);
router.get("/user/:id", getUser);
router.get("/user", auth, getUserById);
router.patch("/user", auth, uploadFile("image"), editUser);
router.delete("/user/:id", deleteUser);

router.post("/country", auth, adminAuth, addCountry);
router.get("/countries", getCountry);
router.get("/country/:id", getCountrybyId);
router.patch("/country/:id", auth, adminAuth, editCountry);
router.delete("/country/:id", auth, deleteCountry);

router.post("/trip", auth, uploadFile("image"), addTrip);
router.get("/trips", getTrip);
router.get("/trip/:id", getTripbyId);
router.patch("/trip/:id", auth, adminAuth, uploadFile("image"), editTrip);
router.delete("/trip/:id", auth, deleteTrip);

router.post("/transaction", auth, uploadFile("image"), addTransaction);
router.get("/orders", getTransaction);
router.get("/transaction/:id", getTransactionbyId);
router.get("/transaction", auth, getTransactionbyCreated);
router.patch(
  "/transaction/:id",
  auth,
  transactionAuth,
  uploadFile("image"),
  editTransaction
);
router.delete("/transaction/:id", deleteTransaction);

router.post("/bookmark", auth, addBookmark);
router.get("/bookmark/:id", auth, getBookmark);
router.get("/your-bookmark", auth, getBookmarkbyIdUser);

module.exports = router;
