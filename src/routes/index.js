const router = require("express").Router();
const auth = require("./auth");
const post = require("./post");
const user = require("./user");
const mount = require("./mount");
const reservasi = require("./reservasi");



router.get("/", (req, res) => {
	res.status(200).json({
		status: true,
		message: "welcome to History of Indonesia - API",
		data: null
	});
});

router.use("/auth", auth);
router.use("/post", post);
router.use("/user", user);
router.use("/mount", mount);
router.use("/reservasi", reservasi);

module.exports = router;