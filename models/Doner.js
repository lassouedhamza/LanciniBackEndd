const mongoose = require('mongoose');
const crypto = require("crypto");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { stringify } = require('querystring');




const DonerSchema = new mongoose.Schema({
  id: Number,
    username:{
        type: String,
        required: [true, "Please enter a username"]
    },
    lastname: {
      type: String,
      required: [true, "Please enter your lastname!"],
      trim: true
  },
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
      },
      resetPasswordToken: String,
      resetPasswordExpire: Date,
     
      phone: {
       
        type: Number,
        
        min: [8, 'Must be at least 8'],
      
        match: [/^(\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)\d{4}$/]
       
      },
      birthDate: {
        type: Date,
       
      },
      gender:{type:String,
        enum: [ "Homme", "Femme" ],
       
    },
 
  
    picture: { type: String },
   
  description:String,
  Amount:Number
  
});
DonerSchema.pre("save",async function(next) {
    if(!this.isModified("password")){
      next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt)
    next();
  });
  DonerSchema.methods.matchPassword = async function(password){
    return await bcrypt.compare(password,this.password);
  };
  DonerSchema.methods.getSignedToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{expiresIn: process.env.JWT_EXPIRE});
  }
  DonerSchema.methods.getResetPasswordToken = function () {
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
  
  const Doner = mongoose.model("Doner",DonerSchema)
  module.exports = Doner;