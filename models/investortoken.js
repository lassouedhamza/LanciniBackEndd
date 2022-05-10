const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
  investorId: {
    type: Schema.Types.ObjectId,
    ref: "Investor",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  
});

const TokenInvestor = mongoose.model("tokenInvestor", tokenSchema);

module.exports = TokenInvestor;
