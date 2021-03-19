const mongoose = require("mongoose"); // Import mongoose
const mongoose_delete = require("mongoose-delete"); // Import mongoose-delete to make soft delete

// Make barang model
const moviesSchema = new mongoose.Schema(
	{
		// Define column that we will used
		Movie: {
			type: String,
			required: true,
		},
		release: {
			type: String,
			default: "--",
			required: false,
		},
		Duration: {
			type: String,
			default: "--",
			required: false,
		},
		Genre: {
			type: String,
			default: "--",
			required: false,
		},
		Director: {
			type: String,
			default: "--",
			required: false,
		},
		Writer: {
			type: String,
			default: "--",
			required: false,
		},
		Sinopsis: {
			type: String,
			default: "--",
			required: false,
		},
		image: {
			type: String,
			required: true,
		},
		Trailer: {
			type: String,
			required: true,
		},
		star: {
			type: Array,
			required: true,
		},
		Rating: {
			type: Number,
			default: 0,
			required: true,
		},
	},
	{
		// enable timestamps
		timestamps: {
			createdAt: "created_at",
			updatedAt: "updated_at",
		},
		versionKey: false,
	}
);
// function setAverageRating(rating) {
// 	return (rating + this.averageRating) / 2;
// }

moviesSchema.plugin(mongoose_delete, { overrideMethods: "all" }); // enable soft delete

module.exports = movies = mongoose.model("movies", moviesSchema, "movies"); // export movies model
