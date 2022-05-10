const { Validator } = require('node-input-validator');
const bcrypt=require('bcrypt');
const crypto =require('crypto');
const Admin = require('../models/Admin')

const ErrorResponse = require('../utils/errorResponse');
const sendEmail = require('../utils/sendEmail');
const jwt=require('jsonwebtoken');



exports.loginAdmin = async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password is provided
  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }

  try {
    // Check that user exists by email
    const admin = await Admin.findOne({ email }).select("+password");

    if (!admin) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    // Check that password match
    const isMatch = await admin.matchPassword(password);

    if (!isMatch) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    sendToken(admin, 200, res);
  } catch (err) {
    next(err);
  }
};
const sendToken =( admin, statusCode, res)=>{
  const token =admin.getSignedToken();
res.status(statusCode).json({succes:true,token})
}


exports.registerAdmin = async (req, res, next) => {
    const {  email, password} = req.body;
  
    try {
      
      const admin = await Admin.create({
        email, password
  
      });
    
        
    } catch (err) {
      next(err);
    }
  };