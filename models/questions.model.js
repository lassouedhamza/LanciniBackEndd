const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
  category : {
    type: Schema.Types.ObjectId,
    ref: 'categories',
    required: [true, "required category"]
  },  
  question: {
    type: String,
    required: [true, "required question"],
  },
  response: {
      type: String,
      required: [true, "required response"]
  },
}, {
  timestamps: true
});

module.exports = mongoose.model("questions", QuestionSchema);
