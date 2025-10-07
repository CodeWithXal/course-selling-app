const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;



// --- User Schema ---

const userSchema = new Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true }
}, { timestamps: true });



// --- Admin Schema ---

const adminSchema = new Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true }
}, { timestamps: true });



// --- Course Schema ---

const courseSchema = new Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  creatorId: { type: ObjectId, ref: "Admin", required: true }
}, { timestamps: true });



// --- Purchase Schema ---

const purchaseSchema = new Schema({
  courseId: { type: ObjectId, ref: "Course", required: true },
  userId: { type: ObjectId, ref: "User", required: true }
}, { timestamps: true });



// --- Models ---

const userModel = mongoose.model("User", userSchema);
const adminModel = mongoose.model("Admin", adminSchema);
const courseModel = mongoose.model("Course", courseSchema);
const purchaseModel = mongoose.model("Purchase", purchaseSchema);



module.exports = {
  userModel,
  adminModel,
  courseModel,
  purchaseModel
};