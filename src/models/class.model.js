const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ClassSchema = new Schema({
  facultyId: { type: String, required: true },
  className: { type: String, required: true },
  classCode: { type: String, required: true, unique: true },
  subjectCode: { type: String }, //BCCS-3001.
  students: { type: [String]},
});

module.exports = mongoose.model("Class", ClassSchema);
