const router = require("express").Router();
const auth = require("./auth");
const post = require("./post");
const user = require("./user");

router.get("/", (req, res) => {
	res.status(200).json({
		status: true,
		message: "welcome to tiketku-API",
		data: null
	});
});

router.use("/auth", auth);
router.use("/post", post);
router.use("/user", user);

module.exports = router;