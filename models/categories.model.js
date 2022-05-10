const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QuestionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("categories", QuestionSchema);
