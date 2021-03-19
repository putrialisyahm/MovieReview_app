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

    getMovieById: [
        check("id", "Movies not Found").custom(async (value) => {
            return await movies.findOne({ _id: value }).then(result => {
                if (!result) {
                    throw new Error("Movie Not Found");
                }
                else
                    return true;
            })
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

    deleteMovie: [
        check("id", "Movies not Foudn").custom(async (value) => {
            return await movies.findOne({ _id: value }).then(result => {
                if (!result) {
                    throw new Error("Movie Not Found");
                }
                else
                    return true;
            })
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
    updateMovie: [
        check("id", "Movies not Foudn").custom(async (value) => {
            return await movies.findOne({ _id: value }).then(result => {
                if (!result) {
                    throw new Error("Movie Not Found");
                }
                else
                    return true;
            })
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
    addMovie: [
        check("Movie", "Movie Must Not be Empty").isString().exists(),
        check("release", "realse Must Not be Empty").isString().exists(),
        check("Duration", "Duration Must Not be Empty").isString().exists(),
        check("Genre", "Genre Must Not be Empty").isString().exists(),
        check("Director", "Director Must Not be Empty").isString().exists(),
        check("Writer", "Writer Must Not be Empty").isString().exists(),
        check("Sinopsis", "Sinopsis Must Not be Empty").isString().exists(),
        check("image", "image Must Not be Empty").isString().exists(),
        check("Trailer", "Trailer Must Not be Empty").isString().exists(),
        check("star", "Star Must Not be Empty").isString().exists(),


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
    search: [
        check("page", "Page Must be Positive").custom(value => {
            if (parseInt(value) < 1) {
                return false;
            }
            else return true;
        }),
        check("page", "Page Not Found").custom(async (value) => {
            return await movies.countDocuments({})
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

    getAllMovie: [
        check("page", "Page Must be Positive").custom(value => {
            if (parseInt(value) < 1) {
                return false;
            }
            else return true;
        }),
        check("page", "Page Not Found").custom(async (value) => {
            return await movies.countDocuments({})
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

    // getMovie: [
    //     check("page", "Page Must be Positive").custom(value => {
    //         if (parseInt(value) < 1) {
    //             return false;
    //         }
    //         else return true;
    //     }),
    //     check("page", "Page Not Found").custom(async (value) => {
    //         return await movies.countDocuments({})
    //             .then((result) => {
    //                 if (Math.ceil(result / numPage) < value) {
    //                     throw new Error("Page Not Found !");
    //                 }
    //                 else return true;

    //             });
    //     }),
    //     check("query", "query must not be empty").isString(),
    //     (req, res, next) => {
    //         const errors = validationResult(req);
    //         if (!errors.isEmpty()) {
    //             return res.status(422).json({
    //                 errors: errors.mapped(),
    //             });
    //         }
    //         next();
    //     },
    // ],
    getMovieCategory: [
        check("page", "Page Must be Positive").custom(value => {
            if (parseInt(value) < 1) {
                return false;
            }
            else return true;
        }),
        check("genre", "Genre must no be empty").isString().custom(value => {
            genres = value.split(",");
            if (genres.length === 1 && genres[0] === "") {
                return false;
            }
            return true;
        }),
        check("page", "Page Not Found").custom(async (value) => {
            return await movies.countDocuments({})
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
