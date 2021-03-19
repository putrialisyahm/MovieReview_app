const express = require("express"); // import express
const router = express.Router(); // import router
const passport = require("passport"); // import passport
const auth = require("../middlewares/auth"); // import passport auth strategy
const UserController = require("../controllers/userController"); // import userController
const userValidator = require("../middlewares/validators/userValidator"); // import userValidator

const userController = require("../controllers/userController");

// if user go to localhost:3000/signup
router.post("/signup", [
	userValidator.signup,
	function (req, res, next) {
		passport.authenticate(
			"signup",
			{
				session: false,
			},
			function (err, user, info) { 
				if (err) {
					return next(err);
				}
				if (!user) {
					res.status(401).json({
						status: "Error",
						message: info.message,
					});
					return;
				}

				UserController.signup(user, req, res, next);
			}
		)(req, res, next);
	},
]);

// if user go to localhost:3000/login
router.post("/login", [
	userValidator.login,
	function (req, res, next) {
		passport.authenticate(
			"login",
			{
				session: false,
			},
			function (err, user, info) {
				if (err) {
					return next(err);
				}
				if (!user) {
					res.status(401).json({
						status: "Error",
						message: info.message,
					});
					return;
				}

				UserController.login(user, req, res, next);
			}
		)(req, res, next);
	},
]);


router.post("/addToWatchList", [
	userValidator.addToWatchList,
	function (req, res, next) {
		passport.authenticate(
			"checkLogin",
			{
				session: false,
			},
			function (err, user, info) {
				if (err) {
					return next(err);
				}
				if (!user) {
					res.status(401).json({
						status: "Error",
						message: info.message,
					});
					return;
				}

				UserController.addToWatchList(user, req, res, next);
			}
		)(req, res, next);
	},
]);

router.put("/insertPP", [
	userValidator.insertPP,
	function (req, res, next) {
		passport.authenticate(
			"checkLogin",
			{
				session: false,
			},
			function (err, user, info) {
				if (err) {
					return next(err);
				}
				if (!user) {
					res.status(401).json({
						status: "Error",
						message: info.message,
					});
					return;
				}

				UserController.insertPP(user, req, res, next);
			}
		)(req, res, next);
	},
]);
//masih belum final
router.get("/getPP/:img", UserController.getPP);

router.post("/addAdmin/", [
	userValidator.addAdmin,
	function (req, res, next) {
		passport.authenticate(
			"checkSuperAdmin",
			{
				session: false,
			},
			function (err, user, info) {
				if (err) {
					return next(err);
				}
				if (!user) {
					res.status(401).json({
						status: "404",
						message: info.message,
					});
					return;
				}

				UserController.addAdmin(user, req, res, next);
			}
		)(req, res, next);
	},
]);



router.get("/getWatchList/", [
	function (req, res, next) {
		passport.authenticate(
			"checkLogin",
			{
				session: false,
			},
			function (err, user, info) {
				if (err) {
					return next(err);
				}
				if (!user) {
					res.status(401).json({
						status: "404",
						message: info.message,
					});
					return;
				}

				UserController.getWatchList(user, req, res, next);
			}
		)(req, res, next);
	},
]);


router.get("/getUserProfile/", [
	function (req, res, next) {
		passport.authenticate(
			"checkLogin",
			{
				session: false,
			},
			function (err, user, info) {
				if (err) {
					return next(err);
				}
				if (!user) {
					res.status(401).json({
						status: "404",
						message: info.message,
					});
					return;
				}

				UserController.getUserProfile(user, req, res, next);
			}
		)(req, res, next);
	},
]);



router.get("/getMyReview/", [
	function (req, res, next) {
		passport.authenticate(
			"checkLogin",
			{
				session: false,
			},
			function (err, user, info) {
				if (err) {
					return next(err);
				}
				if (!user) {
					res.status(401).json({
						status: "404",
						message: info.message,
					});
					return;
				}

				UserController.getMyReview(user, req, res, next);
			}
		)(req, res, next);
	},
]);


router.put("/changeName", [
	userValidator.changeName,
	function (req, res, next) {
		passport.authenticate(
			"checkLogin",
			{
				session: false,
			},
			function (err, user, info) {
				if (err) {
					return next(err);
				}
				if (!user) {
					res.status(401).json({
						status: "404",
						message: info.message,
					});
					return;
				}

				UserController.changeName(user, req, res, next);
			}
		)(req, res, next);
	},
]);

router.put("/changePass", [
	userValidator.changePass,
	function (req, res, next) {
		passport.authenticate(
			"checkLogin",
			{
				session: false,
			},
			function (err, user, info) {
				if (err) {
					return next(err);
				}
				if (!user) {
					res.status(401).json({
						status: "404",
						message: info.message,
					});
					return;
				}

				UserController.changePass(user, req, res, next);
			}
		)(req, res, next);
	},
]);
//kalo router ndak nemu link yang dicari
router.use((req, res, next) => {
	const err = new Error("Page Not Found");
	err.status = 404;
	next(err);
});


//ketika fungsi next dipanggil pakek fungsi ini,
router.use((err, req, res, next) => {
	res.status(err.status || 500);
	res.send({
		error: {
			status: err.status || 500,
			message: err.message,
		},
	});
});
module.exports = router; // export router
