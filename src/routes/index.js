const router = require("express").Router();
const auth = require("./auth");
const post = require("./post");
const user = require("./user");
const mount = require("./mount");
const reservasi = require("./reservasi");
const regulation = require("./regulation");
const order = require("./order");
const admin = require("./admin");
const notif = require("./notif");




router.get("/", (req, res) => {
	res.status(200).json({
		status: true,
		message: "Welcome to API Reservasi Gunung Ungaran",
		version: 1.4
	});
});

router.use("/auth", auth);
router.use("/post", post);
router.use("/user", user);
router.use("/mount", mount);
router.use("/reservasi", reservasi);
router.use("/regulation", regulation);
router.use("/order", order);
router.use("/admin", admin);
router.use("/notif", notif);


module.exports = router;