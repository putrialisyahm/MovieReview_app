const { user, movies, review } = require("../models/mongodb"); // import user models
const passport = require("passport"); // import passport
const jwt = require("jsonwebtoken"); // import jsonwebtoken
const bcrypt = require("bcrypt"); // Import bcrypt
const { sendError, sendResponse } = require("./errorHandler"); // import user models
const numPage = 15;
class MovieController {

    async getMovieById(req, res, next) {
        try {
            const result = await movies.find({
                _id: req.params.id
            }).select("Movie release Duration Genre Director Writer Sinopsis image Trailer star Rating Poster")
            sendResponse(result, 200, res);
        } catch (err) {
            sendError(err.message, 500, next);
        }

    }


    async getAllMovie(req, res, next) {
        try {
            //count number page 
            let page = parseInt(req.params.page) - 1;
            //find movie according to the pages
            const result = await movies.find().skip(page * numPage).limit(numPage)
            const numDocs = await movies.countDocuments({});
            const message = {
                numDocs: numDocs,
                result: result
            }
            sendResponse(message, 200, res);
        } catch (err) {
            sendError(err.message, 500, next);
        }

    }

    async getMovieCategory(req, res, next) {

        try {
            //count number pages
            let page = parseInt(req.params.page) - 1;

            //clean data from req.body.genre
            let genre = req.body.genre.trim();
            genre = genre.split(",");
            genre = genre.map(datum => {
                datum = datum.trim()
                return datum.charAt(0).toUpperCase() + datum.slice(1)
            });

            genre.sort();
            genre = genre.join(",");
            //find movie with the same genre as requested with regex
            const result = await movies.find({ Genre: { $regex: '.*' + genre + '.*', $options: 'i' } }).skip(page * numPage).limit(numPage)
            const numDocs = await movies.countDocuments({ Genre: { $regex: '.*' + genre + '.*', $options: 'i' } });
            const message = {
                numDocs: numDocs,
                result: result
            }
            sendResponse(message, 200, res);
        } catch (err) {
            sendError(err.message, 500, next);
        }
    }

    async search(req, res, next) {
        try {
            let page = parseInt(req.params.page) - 1;
            const result = await movies.find({ Movie: { $regex: '.*' + req.body.query + '.*', $options: 'i' } }).skip(page * numPage).limit(numPage);
            const numDocs = await movies.countDocuments({ Movie: { $regex: '.*' + req.body.query + '.*', $options: 'i' } });
            const message = {
                numDocs: numDocs,
                result: result
            }
            sendResponse(message, 200, res);
        } catch (error) {
            sendError(err.message, 500, next);
        }

    }

    async processData(star) {

        let result = [];
        for (let i = 0; i < star.length; i += 2) {
            star[i] = star[i].trim()
            star[i + 1] = star[i + 1].trim()
            result.push({
                name: star[i],
                link: star[i + 1],
            })
        }
        return result
    }

    async addMovie(token, req, res, next) {
        try {
            //clean data genre before inserting to database;
            let genre = req.body.Genre.split(",");
            genre = genre.sort();
            genre = genre.map(datum => {
                datum = datum.trim()
                return datum.charAt(0).toUpperCase() + datum.slice(1)
            });
            genre = genre.join(",")

            //check format of data star before inserting to database;
            let result;
            let star = req.body.star.split(",");

            //if panjang star kelipatan 2, format sudah benar
            if (star.length % 2 === 0) {
                result = await this.processData(star);
            }
            //else format masih salah
            else {
                sendError("Attributes Star is Wrong, use the star name folowed by the image link divided by a comma", 400, next);
            }
            const createdMovie = await movies.create({
                Movie: req.body.Movie,
                Genre: genre,
                image: req.body.image,
                Director: req.body.Director,
                release: req.body.release,
                Duration: req.body.Duration,
                Writer: req.body.Writer,
                Sinopsis: req.body.Sinopsis,
                Trailer: req.body.Trailer,
                star: result
            })
            if (createdMovie)
                sendResponse("Movie Added Succesfully", 200, res);
            else
                sendError("failed to add movie", 500, next);
        } catch (err) {
            sendError(err.message, 500, next);
        }

    }

    async deleteMovie(token, req, res, next) {
        try {
            const result = await movies.deleteOne({ _id: req.params.id })
            if (result.deletedCount === 1) {
                sendResponse("Movies Deleted Succesfully", 200, res);
            }
        } catch (error) {
            sendError(error.message, 500, next);
        }

    }

    async getAllCategory(req, res, next) {
        try {
            //find all distinct genre from movie
            let allGenre = await movies.distinct("Genre")
            //concatenate all genre to a single string
            const reducer = (accumulator, currentValue) => accumulator + "," + currentValue;
            allGenre = allGenre.reduce(reducer);
            //split all genre
            allGenre = allGenre.split(",");
            //remove all duplicate form genre
            const uniqueGenre = new Set(allGenre);
            //sort genre and convert it back to array
            const backToArray = [...uniqueGenre].sort();
            const result = {
                Category: backToArray,
            }
            sendResponse(result, 200, res);

        } catch (error) {
            sendError(error.message, 400, next)
        }
    }

    async getCarousel(req, res, next) {
        try {
            //find all Poster from movie sorted by Rating descending;
            const result = await movies.find({}).select("Poster").sort({ Rating: -1 }).limit(5);
            sendResponse(result, 200, res);
        } catch (error) {
            sendError(error.message, 400, next)
        }

    }

    async updateMovie(token, req, res, next) {
        try {
            //bersihkan data genre yang diterima
            let genre;
            if (req.body.Genre) {
                genre = req.body.Genre.split(",");
                genre = genre.map((genre) => {
                    return genre.charAt(0).toUpperCase() + genre.slice(1);
                });
                genre = genre.sort();

                genre = genre.join(",")
            }
            //check format star
            //check if req.body.star actually exist
            let result;
            if (req.body.star) {

                let star = req.body.star.split(",");

                if (star.length % 2 === 0) {
                    result = await this.processData(star);
                }
                else {
                    sendError("Attributes Star is Wrong, use the star name folowed by the image link divided by a comma", 400, next);
                }
            }

            let data = {
                Movie: req.body.Movie,
                Genre: genre,
                image: req.body.image,
                Director: req.body.Director,
                release: req.body.release,
                Duration: req.body.Duration,
                Writer: req.body.Writer,
                Sinopsis: req.body.Sinopsis,
                Trailer: req.body.Trailer,
                star: result
            }

            Object.keys(data).forEach(key => data[key] === undefined && delete data[key])
            const updatedMovie = await movies.findOneAndUpdate(
                { _id: req.params.id },
                data

            )
            if (updatedMovie)
                sendResponse("Movie Updated Succesfully", 200, res);
            else
                sendError("failed to update movie", 500, next);
        } catch (error) {
            sendError(error.message, 500, next)
        }
    }
}
module.exports = new MovieController(); // export movieController
