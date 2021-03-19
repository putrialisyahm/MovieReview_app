const express = require("express"); // import express
const router = express.Router(); // import router
const passport = require("passport"); // import passport
const auth = require("../middlewares/auth"); // import passport auth strategy
const movieController = require("../controllers/movieControllers"); // import userController
const movieValidator = require("../middlewares/validators/movieValidator");
// const movieValidator = require("../middlewares/validators/movieValidator"); // import userValidator

// if user go to localhost:3000/signup
// router.get("/getMovie/:page", movieValidator.getMovie, movieController.getmovie);

router.get("/getCarousel/", movieController.getCarousel);

router.post("/getMovieCategory/:page", movieValidator.getMovieCategory, movieController.getMovieCategory);
router.post("/search/:page", movieValidator.search, movieController.search);

router.get("/getAllCategory/", movieController.getAllCategory);
router.get("/getAllMovie/:page", movieValidator.getAllMovie, movieController.getAllMovie);
router.get("/getMovieById/:id", movieValidator.getMovieById, movieController.getMovieById);
router.post("/addMovie/", [
	movieValidator.addMovie,
	function (req, res, next) {
		passport.authenticate(
			"checkAdmin",
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

				movieController.addMovie(user, req, res, next);
			}
		)(req, res, next);
	},
]);

router.put("/updateMovie/:id", [
	movieValidator.updateMovie,
	function (req, res, next) {
		passport.authenticate(
			"checkAdmin",
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

				movieController.updateMovie(user, req, res, next);
			}
		)(req, res, next);
	},
]);


router.delete("/deleteMovie/:id", [
	movieValidator.deleteMovie,
	function (req, res, next) {
		passport.authenticate(
			"checkAdmin",
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

				movieController.deleteMovie(user, req, res, next);
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
