const mongoose = require("mongoose"); // Import mongoose
const mongoose_delete = require("mongoose-delete"); // Import mongoose-delete to make soft delete

// Make barang model
const UserSchema = new mongoose.Schema(
	{
		// Define column that we will used
		username: {
			type: String,
			required: true,
		},
		fullName: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		auth: {
			type: String,
			default: "User",
			required: true,
		},
		profilePic: {
			type: String,
			default: "default.png",
			required: false,
			get: getImage,
		},
		watchList: {
			type: Array,
			default: null,
			required: false,
		},
	},
	{
		// enable timestamps
		timestamps: {
			createdAt: "created_at",
			updatedAt: "updated_at",
		},
		versionKey: false,
		toJSON: { getters: true },
	}
);
function getImage(image) {
	return "/img/" + image;
}

UserSchema.plugin(mongoose_delete, { overrideMethods: "all" }); // enable soft delete

module.exports = user = mongoose.model("user", UserSchema, "user"); // export barang model
