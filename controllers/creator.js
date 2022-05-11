
const { Validator } = require('node-input-validator');
const bcrypt=require('bcrypt');
const crypto =require('crypto');
const Creator = require('../models/Creator')

const ErrorResponse = require('../utils/errorResponse');
const sendEmail = require('../utils/sendEmail');
const jwt=require('jsonwebtoken');



exports.loginCreator = async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password is provided
  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }

  try {
    // Check that user exists by email
    const creator = await Creator.findOne({ email }).select("+password");

    if (!creator) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    // Check that password match
    const isMatch = await creator.matchPassword(password);

    if (!isMatch) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    sendToken(creator, 200, res);
  } catch (err) {
    next(err);
  }
};
const sendToken =( creator, statusCode, res)=>{
  const token =creator.getSignedToken();
res.status(statusCode).json({succes:true,token})
}
exports.registerCreator = async (req, res, next) => {
    const { username, email, password, lastname,Rib,Type,Position,SectorInterest,Company,picture,phone,NumCin,ScanCin} = req.body;
  
    try {
      
      const creator = await Creator.create({
        username,
        lastname,
        email,
        password,
        Rib,
        Type,
        Company,
        Position,
        SectorInterest,picture,phone,NumCin,ScanCin

      });
    
        
    } catch (err) {
      next(err);
    }
  };
  exports.forgotpasswordCreator =async (req, res, next) =>  {
    const{email} =req.body;
    try{
      const creator = await Creator.findOne({email});
      if (!creator){
        return next(new ErrorResponse("Email could not be sent",404))
      }
      // Reset Token Gen and add to database hashed (private) version of token
      const resetToken = creator.getResetPasswordToken();
      await creator.save();
      // Create reset url to email to provided email
  const resetUrl = `http://lancini-lassouedhamza.vercel.app/passwordreset/${resetToken}`;

  // HTML Message
  const message = `
    <h1>You have requested a password reset</h1>
    <p>Please make a put request to the following link:</p>
    <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
  `;

  try {
    await sendEmail({
      to: creator.email,
      subject: "Password Reset Request",
      text: message,
    });

    res.status(200).json({ success: true, data: "Email Sent" });
  } catch (err) {
    console.log(err);

    creator.resetPasswordToken = undefined;
    creator.resetPasswordExpire = undefined;

    await creator.save();
    return next(new ErrorResponse("Email could not be sent", 500));
  }
} catch (err) {
  next(err);
}
};
exports.resetpasswordCreator = async(req,res,next)=>{
const resetPasswordToken = crypto
.createHash("sha256")
.update(req.params.resetToken)
.digest("hex");
try {
    const creator = await Creator.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!creator) {
      return next(new ErrorResponse("Invalid Token", 400));
    }

    creator.password = req.body.password;
    creator.resetPasswordToken = undefined;
    creator.resetPasswordExpire = undefined;

    await creator.save();

    res.status(201).json({
      success: true,
      data: "Password Reset Success"
      
    });
  } catch (err) {
    next(err);
  }

} 
  exports.CompleteprofileCreator = async(req,res,next)=> {
    const user = await Creator.findById(req.params.id);
    if (user) {
      user.gender = req.body.gender || user.gender;
      user.picture = req.body.picture || user.picture;
      user.description = req.body.description || user.description;
      user.birthDate = req.body.birthDate || user.birthDate;
      user.phone = req.body.phone || user.phone;
   
      user.NumCin =req.body.NumCin || user.NumCin;
      user.ScanCin = req.body.ScanCin || user.ScanCin;
      //This will encrypt automatically in our model
      
      const updateUser = await user.save();
      res.json({
        _id: updateUser._id,
        gender: updateUser.gender,
        picture: updateUser.picture,
        birthDate: updateUser.birthDate,
        phone: updateUser.phone,
        description: updateUser.description,
        NumCin : updateUser.NumCin,
        ScanCin: updateUser.ScanCin
   
      });
    } else {
      res.status(401);
      throw new Error('User Not found');
    }
  }
  exports.updateCreator = async (req, res) => {
    let newPass=bcrypt.hashSync(req.body.password,10)
    try {
        const {username, email, password, lastname,Type, Company,Rib,picture,phone,NumCin,ScanCin,Position,SectorInterest} = req.body;
        
        await Creator.findByIdAndUpdate(req.params.id, {username, email, newPass, lastname,Rib,Type,Position,SectorInterest,Company,picture,phone,NumCin,ScanCin})

        res.json({msg: "Update Success!"})
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
};
exports.getAllCreator = async (req, res) => {
  

     
    Creator.find().then(user=>{res.send(user)}).catch(
        err=>{res.status(500).send({message:err.message || "Error Occured while retrieving user information"})}
        )
 };
 exports.findCreatorById =async(req,res)=>{
    const creator = await Creator.findById(req.params.id)
    res.status(200).json(creator)
  }
  exports.deleteCreator = async (req , res) => {
    const creator = await Creator.findById(req.params.id)

    if (!creator) {
      res.status(400)
      throw new Error('investor not found')
    }

    await creator.remove()
    res.status(200).json({id : req.params.id})
}