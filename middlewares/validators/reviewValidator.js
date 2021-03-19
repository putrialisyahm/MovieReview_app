const { equal } = require("assert");
const {
	check,
	validationResult,
	matchedData,
	sanitize,
} = require("express-validator"); //form validation & sanitize form params
const { review, user, movies } = require("../../models/mongodb"); // Import user model
const numPage = 15;
module.exports = {
	addReview: [
		check("rating", "rating must be between 1-5")
			.isNumeric()
			.custom((value) => {
				if (value < 0 || value > 5) {
					return false;
				}
				return true;
			}),
		check("review", "your character must fit around 255")
			.isString()
			.isLength({ max: 255, min: 5 }),
		check("id", "Movie not exist").custom(async (value) => {
			return await movies.findOne({ _id: value }).then((result) => {

				if (!result) {
					throw new Error("movies not found");
				}
				return true;
			});


		}),

		(req, res, next) => {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(422).json({
					errors: errors.mapped(),
				});
			}
			next();
		},
	],
	updateReview: [
		check("rating", "rating must be between 1-5")
			.isNumeric()
			.custom((value) => {
				if (value < 0 || value > 5) {
					return false;
				}
				return true;
			}),
		check("review", "your character must fit around 255")
			.isString()
			.isLength({ max: 255, min: 5 }),
		check("id", "Review not exist").custom(async (value) => {
			return await review.findOne({ _id: value }).then((result) => {
				if (!result) {
					throw new Error("Review not found");
				}
				return true;
			});
		}),

		(req, res, next) => {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(422).json({
					errors: errors.mapped(),
				});
			}
			next();
		},
	],
	deleteReview: [
		check("id", "Review not exist").custom(async (value) => {
			return await review.findOne({ _id: value }).then((result) => {

				if (!result) {
					throw new Error("Review not found");
				}
				return true;
			});
		}),

		(req, res, next) => {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(422).json({
					errors: errors.mapped(),
				});
			}
			next();
		},
	],
	getReview: [
		check("id", "Movie not exist").custom(async (value) => {
			return await movies.findOne({ _id: value }).then((result) => {

				if (!result) {
					throw new Error("movies not found");
				}
				return true;
			});
		}),
		check("page", "Page Must be Positive").custom(value => {
			if (parseInt(value) < 1) {
				return false;
			}
			else return true;
		}),
		check("page", "Page Not Found").custom(async (value, { req }) => {
			return await review.countDocuments({ Movie: req.params.id })
				.then((result) => {
					if (Math.ceil(result / numPage) < value) {
						throw new Error("Page Not Found !");
					}
					else return true;

				});
		}),

		(req, res, next) => {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(422).json({
					errors: errors.mapped(),
				});
			}
			next();
		},
	],
};
