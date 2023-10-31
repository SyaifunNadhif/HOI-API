const router = require("express").Router();
const auth = require("./auth");

router.get("/", (req, res) => {
	res.status(200).json({
		status: true,
		message: "welcome to tiketku-API",
		data: null
	});
});

router.use("/auth", auth);

module.exports = router;