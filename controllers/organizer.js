const { Validator } = require('node-input-validator');
const bcrypt=require('bcrypt');
const crypto =require('crypto');
const Organizer = require('../models/Organizer')

const ErrorResponse = require('../utils/errorResponse');
const sendEmail = require('../utils/sendEmail');
const jwt=require('jsonwebtoken');



exports.loginOrganizer = async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password is provided
  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }

  try {
    // Check that user exists by email
    const organizer = await Organizer.findOne({ email }).select("+password");

    if (!organizer) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    // Check that password match
    const isMatch = await organizer.matchPassword(password);

    if (!isMatch) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    sendToken(organizer, 200, res);
  } catch (err) {
    next(err);
  }
};
const sendToken =( organizer, statusCode, res)=>{
  const token =organizer.getSignedToken();
res.status(statusCode).json({succes:true,token})
}


exports.registerOrganizer = async (req, res, next) => {
    const {  email, password} = req.body;
  
    try {
      
      const organizer = await Organizer.create({
        email, password
  
      });
    
        
    } catch (err) {
      next(err);
    }
  };