const Doner = require('../models/Doner');
const { Validator } = require('node-input-validator');
const bcrypt=require('bcrypt');


const crypto =require('crypto');


const ErrorResponse = require('../utils/errorResponse');
const sendEmail = require('../utils/sendEmail');


const jwt=require('jsonwebtoken');
exports.loginDoner = async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password is provided
  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }

  try {
    // Check that user exists by email
    const doner = await Doner.findOne({ email }).select("+password");

    if (!doner) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    // Check that password match
    const isMatch = await doner.matchPassword(password);

    if (!isMatch) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    sendToken(doner, 200, res);
  } catch (err) {
    next(err);
  }
};
const sendToken =( doner, statusCode, res)=>{
  const token =doner.getSignedToken();
res.status(statusCode).json({succes:true,token})
}
exports.forgotpasswordDoner =async (req, res, next) =>  {
  const{email} =req.body;
  try{
    const doner = await Doner.findOne({email});
    if (!doner){
      return next(new ErrorResponse("Email could not be sent",404))
    }
    // Reset Token Gen and add to database hashed (private) version of token
    const resetToken = doner.getResetPasswordToken();
    await doner.save();
    // Create reset url to email to provided email
const resetUrl = `http://localhost:3000/passwordreset/${resetToken}`;

// HTML Message
const message = `
  <h1>You have requested a password reset</h1>
  <p>Please make a put request to the following link:</p>
  <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
`;

try {
  await sendEmail({
    to: doner.email,
    subject: "Password Reset Request",
    text: message,
  });

  res.status(200).json({ success: true, data: "Email Sent" });
} catch (err) {
  console.log(err);

  doner.resetPasswordToken = undefined;
  doner.resetPasswordExpire = undefined;

  await doner.save();
  return next(new ErrorResponse("Email could not be sent", 500));
}
} catch (err) {
next(err);
}
};
exports.resetpasswordDoner = async(req,res,next)=>{
const resetPasswordToken = crypto
.createHash("sha256")
.update(req.params.resetToken)
.digest("hex");
try {
  const doner = await Doner.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!doner) {
    return next(new ErrorResponse("Invalid Token", 400));
  }

  doner.password = req.body.password;
  doner.resetPasswordToken = undefined;
  doner.resetPasswordExpire = undefined;

  await doner.save();

  res.status(201).json({
    success: true,
    data: "Password Reset Success"
    
  });
} catch (err) {
  next(err);
}

} 

exports.registerDoner = async (req, res, next) => {
    const { username, email, password,lastname,Amount,picture,phone} = req.body;
  
    try {
      
      const doner = await Doner.create({
        username, email, password,lastname,Amount,picture,phone

      });
    
        
    } catch (err) {
      next(err);
    }
  };
  exports.CompleteprofileDoner = async(req,res,next)=> {
    const doner = await Doner.findById(req.params.id);
    if (doner) {
      doner.gender = req.body.gender || doner.gender;
      doner.picture = req.body.picture || doner.picture;
      doner.birthDate = req.body.birthDate || doner.birthDate;
      doner.phone = req.body.phone || doner.phone;
     
      //This will encrypt automatically in our model
      
      const updateUser = await doner.save();
      res.json({
        _id: updateUser._id,
        gender: updateUser.gender,
        picture: updateUser.picture,
        birthDate: updateUser.birthDate,
       
        phone: updateUser.phone,
      
   
      });
    } else {
      res.status(401);
      throw new Error('doner Not found');
    }
  }
  exports.updateDoner = async (req, res) => {
    let newPass=bcrypt.hashSync(req.body.password,10)
    try {
        const {username, email, password, lastname,picture,phone,Amount} = req.body;
        
        await Doner.findByIdAndUpdate(req.params.id, {username, email, newPass, lastname,picture,phone,Amount})

        res.json({msg: "Update Success!"})
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
};
exports.findDonerById =async(req,res)=>{
  const doner = await Doner.findById(req.params.id)
  res.status(200).json(doner)
}

exports.DeleteDoner = async (req , res) => {
  const doner = await Doner.findById(req.params.id)

  if (!doner) {
    res.status(400)
    throw new Error('doner not found')
  }

  await doner.remove()
  res.status(200).json({id : req.params.id})
}
exports.getAllDoner= async (req, res) => {
   
  
  Doner.find().then(doner=>{res.send(doner)}).catch(
       err=>{res.status(500).send({message:err.message || "Error Occured while retrieving user information"})}
       )
};