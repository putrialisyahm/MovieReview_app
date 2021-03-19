const {
	check,
	validationResult,
	matchedData,
	sanitize,
} = require("express-validator"); //form validation & sanitize form params
const { user } = require("../../models/mongodb"); // Import user model
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

const uploadDir = "/img/";
const storage = multer.diskStorage({
	destination: "./public" + uploadDir,
	filename: function (req, file, cb) {
		crypto.pseudoRandomBytes(16, function (err, raw) {
			if (err) return cb(err);

			cb(null, raw.toString("hex") + path.extname(file.originalname));
		});
	},
});

const upload = multer({ storage: storage, dest: uploadDir });
module.exports = {

	addAdmin: [
		check("user", "User Not Found").custom(async (value) => {
			return await user.findOne({ _id: value }).then(result => {
				if (!result) {
					throw new Error("User Not Found");
				}
				else
					return true;
			})
		}),
	],

	signup: [
		check("username", "Username Must have minimum 5 characters")
			.isString()
			.isLength({ min: 5, max: 32 }),
		check("fullName", "Full name Must have minimum 5 characters")
			.isString()
			.isLength({ min: 3, max: 32 }),
		check("username", "Username Telah Dipakai").custom(async (value) => {
			const result = await user.findOne({ username: value });

			if (result !== null) {
				throw new Error("Username Sudah Dipakai");
			}
		}),
		check("email", "email field must be email address")
			.normalizeEmail()
			.isEmail(), // check req.body.email is email?
		check("email", "Email Telah Dipakai").custom(async (value) => {
			const result = await user.findOne({ email: value });

			if (result !== null) {
				throw new Error("Email Sudah Terpakai");
			}
		}),
		check("password", "password field must have 8 to 32 characters")
			.isString()
			.isLength({ min: 8, max: 32 }),
		check(
			"passwordConfirmation",
			"passwordConfirmation field must have the same value as the password field"
		)
			.exists()
			.custom((value, { req }) => value === req.body.password),
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
	login: [
		// check("username", "Username Must have minimum 5 characters")
		// 	.isString()
		// 	.isLength({ min: 5, max: 32 }),
		check("email", "email field must be email address")
			.normalizeEmail()
			.isEmail(), // check req.body,email is email?
		check("password", "password field must have 8 to 32 characters")
			.isString()
			.isLength({ min: 8, max: 32 }),
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
	//masih belum final
	insertPP: [upload.single("image")],

	changeName: [
		check("fullName", "Full name Must have minimum 5 characters")
			.isString()
			.isLength({ min: 3, max: 32 }),
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

	addToWatchList: [
		check("movieId", "Movie Not Found").custom(async (value) => {
			return await movies.findOne({ _id: value }).then((result) => {
				if (!result) {
					throw new Error("movies not found");
				}
				return true;
			});
		}),
	],

	changePass: [
		check("oldPassword", "password field must have 8 to 32 characters")
			.isString()
			.isLength({ min: 8, max: 32 }),
		check("newPassword", "password field must have 8 to 32 characters")
			.isString()
			.isLength({ min: 8, max: 32 }),
		check(
			"passwordConfirmation",
			"passwordConfirmation field must have the same value as the password field"
		)
			.exists()
			.custom((value, { req }) => value === req.body.newPassword),
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
