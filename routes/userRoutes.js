const express = require('express');
const userControllers = require('../controllers/userControllers');
const router = express.Router();

// @route - /api/v1/user/
router.route("/user_list").get(userControllers.getAllUsers);
router.route("/user_register").post(userControllers.createNewUser);
router.route("/user_login").post(userControllers.userLogin);
router.route("/user_detail/").get(userControllers.getUserById);
router.route("/user_update/:user_id").patch(userControllers.updateUserById);
router.route("/user_delete/").delete(userControllers.deleteUserById);

router.delete(userControllers.deleteAllUsers);
module.exports = router;