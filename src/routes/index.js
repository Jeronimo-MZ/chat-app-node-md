const { Router } = require("express");
const { chatRouter } = require("./ChatRoutes.js");
const { userRouter } = require("./UserRoutes.js");

const router = Router();

router.use(userRouter);
router.use(chatRouter);

module.exports = { router };
