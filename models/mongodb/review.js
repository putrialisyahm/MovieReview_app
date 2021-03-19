const mongoose = require("mongoose"); // Import mongoose
const mongoose_delete = require("mongoose-delete"); // Import mongoose-delete to make soft delete

// Make barang model
const reviewSchema = new mongoose.Schema(
    {
        // Define column that we will used
        User: {
            type: String,
            required: true,
        },
        Movie: {
            type: String,
            required: true,
        },
        review: {
            type: String,
            required: true,
        },
        rating: {
            type: Number,
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

reviewSchema.plugin(mongoose_delete, { overrideMethods: "all" }); // enable soft delete

module.exports = movies = mongoose.model("review", reviewSchema, "review"); // export review model
