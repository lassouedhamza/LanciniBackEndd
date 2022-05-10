const mongoose = require('mongoose');
const crypto = require("crypto");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { stringify } = require('querystring');

const OrganizerSchema = new mongoose.Schema({
  id: Number,
    
    email: {
        type: String,
        required: [true, "Please provide a email"],
        unique: true,
        trim: true,
        match: [
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          "Please provide a valid email",
        ],

    },
    password: {
        type: String,
        required: [true, "Please add a password"],
        minlength: 6,
        select: false,
      }
     });
     OrganizerSchema.pre("save",async function(next) {
    if(!this.isModified("password")){
      next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt)
    next();
  });
  OrganizerSchema.methods.matchPassword = async function(password){
    return await bcrypt.compare(password,this.password);
  };
  OrganizerSchema.methods.getSignedToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{expiresIn: process.env.JWT_EXPIRE});
  }
  OrganizerSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");
  
    // Hash token (private key) and save to database
    this.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
  
    // Set token expire date
    this.resetPasswordExpire = Date.now() + 10 * (60 * 1000); // Ten Minutes
  
    return resetToken;
  };
  
  const Organizer = mongoose.model("Organizer",OrganizerSchema)
  module.exports = Organizer;