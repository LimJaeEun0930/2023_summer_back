const login = require("./login");
//const logoutHandler = require("./logout");

const express = require("express");
const router = express.Router();

router.post("/login", login);
//router.post("/logout", logoutHandler);

module.exports = router;
