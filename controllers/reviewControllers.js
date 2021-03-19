const { user, movies, review } = require("../models/mongodb"); // import user models
const passport = require("passport"); // import passport
const jwt = require("jsonwebtoken"); // import jsonwebtoken
const bcrypt = require("bcrypt"); // Import bcrypt
const { sendError, sendResponse } = require("./errorHandler"); // import user models
const numPage = 15;

class reviewController {
	async getReview(req, res, next) {
		try {
			let page = parseInt(req.params.page) - 1;
			const result = await review.find({ Movie: req.params.id }).select("Movie User review rating").skip(page * numPage).limit(numPage)
			const numDocs = await review.countDocuments({ Movie: req.params.id });
			const message = {
				numDocs: numDocs,
				result: result,
			}
			sendResponse(message, 200, res)
		} catch (error) {
			sendError(error.message, 500, next);
		}

	}

	async addReview(token, req, res, next) {
		const addReview = {
			Movie: req.params.id,
			User: token._id,
			review: req.body.review,
			rating: req.body.rating,
		};
		const query = { $and: [{ Movie: { $eq: req.params.id } }, { User: { $eq: token._id } }] },
			update = addReview,
			options = { upsert: true, new: false, setDefaultsOnInsert: true };

		try {

			//check if user have reviewd the movie before
			const haveReview = await review.findOneAndUpdate(query, update, options)
			if (haveReview) {
				sendError("You have reviewed this movie before", 400, next);
			}
			const movie = await movies.findOne({ _id: req.params.id });
			//if the movie is found, count the number of rating, if rating == 0 (ie, no rating),
			// insert the user rating as is, else, find the average of the rating;
			if (movie) {
				const newRating = parseInt(req.body.rating);
				const oldRating = parseInt(movie.Rating);

				const rating = oldRating === 0 ? newRating : (newRating + oldRating) / 2;
				//update the movie rating in movies collection
				await movies.findOneAndUpdate({ _id: req.params.id }, { $set: { Rating: newRating } }, { new: true })
				sendResponse("Review Added Successfuly", 200, res);
			}

		} catch (error) {
			sendError(error.message, 500, next);
		}

	}

	async deleteReview(token, req, res, next) {
		try {
			let userReview = await review.findOne({ _id: req.params.id });
			let movieId = userReview.Movie;

			//hitung jumlah review
			let count = await review.countDocuments({ Movie: movieId });
			count = parseInt(count);

			let newRating = 0;

			//jika jumlah rating lebih dari 1, hitung ulang rata-rata rating movie
			// else, masukan rating 0 pada movie
			if (count > 1) {
				//hitung total jumlah rating 
				let rating = await movies.findOne({ _id: movieId }).select("Rating");
				rating = rating.Rating;

				rating = parseInt(rating);
				let totalRating = count * rating;
				totalRating -= parseInt(userReview.rating)

				//hitung ulang rata-rata rating movie
				newRating = totalRating / (count - 1);
			}
			//update movie Rating
			await movies.findOneAndUpdate({ _id: movieId }, { $set: { Rating: newRating } })

			const result = await review.deleteOne({ _id: req.params.id });
			if (result.deletedCount === 1) {
				sendResponse("Review Deleted Succesfully", 200, res);
			}
		} catch (error) {
			sendError(error.message, 500, next);
		}

	}

	async updateReview(token, req, res, next) {
		try {
			//update userReview;   
			const userReview = await review.findOneAndUpdate({ _id: req.params.id, User: token._id },
				{
					review: req.body.review,
					rating: req.body.rating
				},
				{ new: false }
			);

			if (userReview) {
				const movieId = userReview.Movie;

				//count number of review a movie has
				const countReview = await review.countDocuments({ Movie: movieId });
				let result;

				//if number of review is more than 1, we have to recalculate movie rating
				if (countReview !== 1) {
					let oldRating = parseInt(userReview.rating);
					let newRating = parseInt(req.body.rating);

					newRating = newRating - oldRating;

					//count new Rating
					let rating = parseFloat(result.Rating);
					rating = ((rating * 2) + newRating) / 2
					//update movie Rating
					result = await movies.findOneAndUpdate({ _id: movieId }, { Rating: rating }, { new: true })
				}

				//if number of review is 1, we can directly update movie rating with user rating
				else {
					result = await movies.findOneAndUpdate({ _id: movieId }, { Rating: req.body.rating }, { new: true })
				}
				sendResponse("Review updated Successfuly", 200, res);
			}
		} catch (error) {
			sendError(error.message, 500, next);
		}

	}
}
module.exports = new reviewController(); // export UserController
