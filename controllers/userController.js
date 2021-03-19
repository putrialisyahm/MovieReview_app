const { user, review, movies } = require("../models/mongodb"); // import user models
const passport = require("passport"); // import passport
const jwt = require("jsonwebtoken"); // import jsonwebtoken
const bcrypt = require("bcrypt"); // Import bcrypt
const { sendError, sendResponse } = require("./errorHandler"); // import user models

class UserController {
	// if user signup
	async signup(user, req, res) {
		// get the req.user from passport authentication

		const body = {
			_id: user._id,
		};

		// create jwt token from body variable
		const token = jwt.sign(
			{
				user: body,
			},
			"secret_password"
		);
		const userInfo = {
			email: user.email,
			profilePic: user.profilePic,
			username: user.username,
			fullName: user.fullName,
		}
		// success to create token
		res.status(200).json({
			user: userInfo,
			message: "Signup success!",
			token: token,
		});
	}

	// // if user login
	async login(user, req, res) {

		const body = {
			_id: user._id,
		};

		// create jwt token from body variable
		const token = jwt.sign(
			{
				user: body,
			},
			"secret_password"
		);

		const userInfo = {
			email: user.email,
			profilePic: user.profilePic,
			username: user.username,
			fullName: user.fullName,
		}

		// success to create token
		res.status(200).json({
			user: userInfo,
			message: "Login success!",
			token: token,
		});
	}

	async insertPP(token, req, res) {

		try {
			const result = await user.findOneAndUpdate({ _id: token._id, },
				{ $set: { profilePic: req.file === undefined ? "" : req.file.filename, }, },
				{ new: true }
			)
			res.status(200).json({
				message: "Uploaded Successfuly",
				result: result.profilePic,
			});

		} catch (error) {
			sendError(error.message, 500, next);
		}
	}

	async changeName(token, req, res) {
		try {
			await user.updateOne({ _id: token._id }, { $set: { fullName: req.body.fullName } });
			sendResponse("Name Changed Successfully", 200, res);
		} catch (error) {
			sendError(error.message, 500, next);
		}
	}

	async changePass(token, req, res, next) {
		try {
			const findUser = await user.findOne({ _id: token._id })
			const validate = await bcrypt.compare(req.body.oldPassword, findUser.password);
			if (validate) {
				await user.updateOne({ _id: token._id }, { password: bcrypt.hashSync(req.body.newPassword, 10) })
				sendResponse("Password Changed Successfully", 200, res);
			} else {
				sendError("You've entered the wrong password", 400, next);
			}
		} catch (error) {
			sendError(error.message, 500, next);
		}


	}

	async getMyReview(token, req, res, next) {
		try {
			const result = await review.find({ User: token._id }).select("Movie User rating review");
			const numDocs = await movies.count({ User: token._id });
			const message = {
				numDocs: numDocs,
				result: result
			}
			sendResponse(message, 200, res);
		} catch (err) {
			sendError(err.message, 500, next);
		}

	}

	async addAdmin(token, req, res, next) {
		try {
			const result = await user.findOneAndUpdate({ _id: req.body.user }, { auth: "admin" })
			sendResponse("User with ID : " + result._id + " elevated to Admin", 200, res);
		} catch (err) {
			sendError(err.message, 500, next);
		}

	}

	async getWatchList(token, req, res, next) {
		try {
			const result = await user.find({ _id: token._id }).select("watchList")
			sendResponse(result, 200, res);
		} catch (err) {
			sendError(err.message, 500, next);
		}

	}

	async addToWatchList(token, req, res, next) {
		try {
			const movie = await movies.findOne({ _id: req.body.movieId }).select("Movie release Duration Genre Director Writer Sinopsis image Trailer Rating");
			const result = await user.find({ $and: [{ watchList: { $elemMatch: movie } }, { _id: token._id }] })
			if (result.length === 0) {
				let result = await user.findOneAndUpdate({ _id: token._id },
					{ $push: { watchList: movie } }
				)
				const message = {
					message: "movie added to watchList",
					movie: movie,
				}
				sendResponse(message, 200, res);
			}
			else {
				sendError("You have added this movie to your watchList", 400, next);
			}
		} catch (err) {
			sendError(err.message, 500, next);
		}
	}

	async getPP(req, res) {
		user.findOne({ email: req.body.email }).then((result) => {
			res.status(200).json({
				message: "Uploaded Successfuly",
				result: result.profilePic,
			});
		});
	}

	async getUserProfile(token, req, res, next) {
		user.findOne({ _id: token._id }).select("email username fullName profilePic").then((result) => {
			if (result) {
				sendResponse(result, 200, res);
			}
		}).catch(err => {
			sendError(err.message, 500, next);
		})
	}
}

module.exports = new UserController(); // export UserController
