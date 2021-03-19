const passport = require("passport"); // Import passport
const localStrategy = require("passport-local").Strategy; // Import Strategy
const { user, movies, review } = require("../../models/mongodb"); // Import user model
const bcrypt = require("bcrypt"); // Import bcrypt
const JWTstrategy = require("passport-jwt").Strategy; // Import JWT Strategy
const ExtractJWT = require("passport-jwt").ExtractJwt; // Import ExtractJWT

// If user sign up
passport.use(
	"signup",
	new localStrategy(
		{
			usernameField: "email", // field for username from req.body.email
			passwordField: "password", // field for password from req.body.password
			passReqToCallback: true, // read other requests
		},
		async (req, email, password, done) => {
			// Create user data
			const hash = bcrypt.hashSync(password, 10);
			user.create({
				username: req.body.username,
				fullName: req.body.fullName,
				email: email,
				password: hash, // password get from passwordField (req.body.passport)
				// role get from req.body.role
			})
				.then((result) => {
					// If success, it will return authorization with req.user
					return done(null, result, {
						message: "User created!",
					});
				})
				.catch((err) => {
					// If error, it will return not authorization
					return done(null, false, {
						message: "User can't be created",
					});
				});
		}
	)
);

// If user login
passport.use(
	"login",
	new localStrategy(
		{
			usernameField: "email", // username from req.body.email
			passwordField: "password",
			// passReqToCallback: true, // password from req.body.password
		},
		async (email, password, done) => {
			// find user depends on email
			const userLogin = await user.findOne({
				email: email,
			}).select("username fullName email profilePic password");

			// if user not found
			if (!userLogin) {
				return done(null, false, {
					message: "Email or Password is wrong",
				});
			}

			// if user found and validate the password of user
			const validate = await bcrypt.compare(password, userLogin.password);

			// if wrong password
			if (!validate) {
				return done(null, false, {
					message: "Email or Password is wrong",
				});
			}

			// login success
			return done(null, userLogin, {
				message: "Login success!",
			});
		}
	)
);

//

passport.use(
	"checkLogin",
	new JWTstrategy(
		{
			secretOrKey: "secret_password", // key for jwt
			jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(), // extract token from authorization

		},
		async (token, done) => {
			// find user depend on token.user.email
			user.findOne({
				_id: token.user._id,
			}).then((result) => {
				if (result !== null) {
					return done(null, token.user);
				} else {
					return done(null, false, { message: "user Not found" });
				}
			});
		}
	)
);

passport.use(
	"checkAdmin",
	new JWTstrategy(
		{
			secretOrKey: "secret_password", // key for jwt
			jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(), // extract token from authorization

		},

		async (token, done) => {
			// find user depend on token.user.email
			user.findOne({
				_id: token.user._id,
			}).then((result) => {

				if (result !== null) {
					if (result.auth === "admin") {
						return done(null, token.user);
					}
					else {
						return done(null, false, { message: "You're Not Authorized" });
					}
				} else {
					return done(null, false, { message: "user Not found" });
				}
			});
		}
	)
);

passport.use(
	"checkSuperAdmin",
	new JWTstrategy(
		{
			secretOrKey: "secret_password", // key for jwt
			jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(), // extract token from authorization

		},

		async (token, done) => {
			// find user depend on token.user.email
			user.findOne({
				_id: token.user._id,
			}).then((result) => {

				if (result !== null) {
					if (result.auth === "root") {
						return done(null, token.user);
					}
					else {
						return done(null, false, { message: "You're Not Authorized" });
					}
				} else {
					return done(null, false, { message: "user Not found" });
				}
			});
		}
	)
);


passport.use(
	"checkReviewAuth",
	new JWTstrategy(
		{
			secretOrKey: "secret_password", // key for jwt
			jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(), // extract token from authorization
			passReqToCallback: true,
		},

		async (req, token, done) => {
			// find user depend on token.user.email

			review.findOne({
				User: token.user._id,
				_id: req.params.id,
			}).then((result) => {
				if (result !== null) {
					return done(null, token.user);
				} else {
					return done(null, false, { message: "Review Not found" });
				}
			}).catch(err => {
				return done(null, false, { message: err.message })
			});
		}
	)
);
