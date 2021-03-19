const express = require("express"); // import express
const router = express.Router(); // import router
const passport = require("passport"); // import passport
const auth = require("../middlewares/auth"); // import passport auth strategy
const reviewController = require("../controllers/reviewControllers"); // import userController
const reviewValidator = require("../middlewares/validators/reviewValidator"); // import userValidator


router.get("/getReview/:id/:page", reviewValidator.getReview, reviewController.getReview);
router.post("/addReview/:id", [
	reviewValidator.addReview,
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

				reviewController.addReview(user, req, res, next);
			}
		)(req, res, next);
	},
]);

router.put("/updateReview/:id", [
	reviewValidator.updateReview,
	function (req, res, next) {
		passport.authenticate(
			"checkReviewAuth",
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

				reviewController.updateReview(user, req, res, next);
			}
		)(req, res, next);
	},
]);

router.delete("/deleteReview/:id", [
	reviewValidator.deleteReview,
	function (req, res, next) {
		passport.authenticate(
			"checkReviewAuth",
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

				reviewController.deleteReview(user, req, res, next);
			}
		)(req, res, next);
	},
]);


router.use((req, res, next) => {
	const err = new Error("Page Not Found");
	err.status = 404;
	next(err);
});

router.use((err, req, res, next) => {
	res
		.status(err.status || 500)
		.json({
			error: {
				status: err.status || 500,
				message: err.message,
			},
		});
});
module.exports = router; // export router
