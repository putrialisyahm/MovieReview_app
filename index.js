const express = require("express"); // Import express
const app = express(); // Make express app
const bodyParser = require("body-parser"); // Import bodyParser

const userRoutes = require("./routes/userRoutes"); // Import userRoutes
const reviewRoutes = require("./routes/reviewRoutes.js"); // Import userRoutes
const movieRoutes = require("./routes/movieRoutes.js");
var cors = require('cors');

//Set body parser for HTTP post operation

app.use(cors());

app.use(bodyParser.json()); // support json encoded bodies
app.use(
	bodyParser.urlencoded({
		extended: true,
	})
); // support encoded bodies

//set static assets to public directory
app.use(express.static("public"));

app.use("/user/", userRoutes); // if accessing localhost:3000/*, it will go to userRoutes
app.use("/review/", reviewRoutes); // if accessing localhost:3000/*, it will go to userRoutes
app.use("/movie/", movieRoutes);
app.listen(3000, () => console.log("Server running on localhost:3000")); // Run server with port 3000
// app.listen(80, () => console.log("Server running on localhost:3000")); // Run server with port 3000

module.exports = app;