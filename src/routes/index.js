const router = require("express").Router();
const auth = require("./auth");
const post = require("./post");
const user = require("./user");
const mount = require("./mount");
const reservasi = require("./reservasi");
const regulation = require("./regulation");



router.get("/", (req, res) => {
	res.status(200).json({
		status: true,
		message: "Welcome to API Reservasi Pendakian Gunung Ungaran",
		data: null
	});
});

router.use("/auth", auth);
router.use("/post", post);
router.use("/user", user);
router.use("/mount", mount);
router.use("/reservasi", reservasi);
router.use("/regulation", regulation);

module.exports = router;