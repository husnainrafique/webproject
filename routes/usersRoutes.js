const express = require("express");
const userController = require("../controllers/usersController");
const router = express.Router();

router.get("/users", userController.getAllUsers);
router.post("/users", userController.createUser);
router.get("/users/:id", userController.getUserById);
router.put("/users/:id", userController.updateUser);
router.post("/users/signup", userController.signup);
router.post("/users/login", userController.login);

module.exports = router;
