
const { Validator } = require('node-input-validator');
const bcrypt=require('bcrypt');
const crypto =require('crypto');
const Investor = require('../models/Investor')
const UserVerification = require('../models/UserVerification')
const ErrorResponse = require('../utils/errorResponse');
const sendEmail = require('../utils/sendEmail');
const jwt=require('jsonwebtoken');
const nodemailer = require("nodemailer");
const path = require("path");
const {v4:uuidv4} = require("uuid");

require("dotenv").config()
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
/*let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.Auth_PASS,
  },
});
transporter.verify((error,success)=>{
  if (error){
    console.log(error);
  }else{
    console.log("Ready for messages");
    console.log(success);
  }
})*/



exports.registerInvestor = async (req, res, next) => {
  const { username, email, password,lastname,category,round,picture,NumCin,ScanCin,Legalname,AmountcanInvest,Typeinvestor,Minrange,Maxrange,SweetSpot,currentinvesting,Position,Company,InvestmentOnRecord,CurrentFundSize,SectorInterest} = req.body;

  try {
    
    const investor = await Investor.create({
      username, email, password, lastname,AmountcanInvest,category,round,picture,NumCin,ScanCin,Legalname,Typeinvestor,Minrange,Maxrange,SweetSpot,currentinvesting,Position,Company,InvestmentOnRecord,CurrentFundSize,SectorInterest

    });
  
      
  } catch (err) {
    next(err);
  }
};




//verification mail 
// @desc    Verify email
// @route   GET /api/entrepreneurs/verify/:id/:token
// @access  Private
const verifyEmail = (async (req, res) => {
  const investor = await Investor.findById(req.params.id)
  if (!investor) {
    res.status(400).send('Invalid link')
  }
  const token = await Token.findOne({
    investorId: investor._id,
    token: req.params.token
  })
  if (!token) {
    res.status(400).send('Invalid link')
  }

  await Investor.updateOne({ _id: investor._id }, { valid: true })
  await Token.deleteOne({ _id: token._id })

  res.send('Email verified successfully')

})








const sendVerificationEmail =({_id,email},res)=>{
  
  const currentUrl="http://localhost:3000/";
  const uniqueString=uuidv4()+_id;
 
  const saltRounds =10 ;
  bcrypt.hash(uniqueString,saltRounds).then((hashedUniqueString)=>{
    const newVerification = new UserVerification({
      userId:_id,
      uniqueString:hashedUniqueString,
      createdAt:Date.now(),
      expiresAt: Date.now()+21600000,
    });
    newVerification.save().then(
      ()=> {
       sendEmail( {from: process.env.EMAIL_FROM,
        to: email,
        subject: "Verify your email !",
        text:`<p> Verify your email adress to complete the  signup and login into your account . </p><p>This link <b> expires in 6 hours </b> ${mail}.
        </p><p>Press  <a >here</a> to proced.</p>`,
       }
        )
      }
    ).catch((error)=>{
        console.log(error);
        res.json({status:"FAILED",
        message:"verification email failed !"})})
  })
}
/*exports.verify=async (req,res,next)=>{
  let {userId,uniqueString}=req.params;
  UserVerification.find({userId}).then(
    (result)=> { if(result.length>0){
     const {expiresAt}=result[0];
     const hashedUniqueString =result[0].uniqueString;
     if (expiresAt<Date.now()){
       UserVerification.deleteOne({userId}).then(
         result =>{
           User.deleteOne({_id:userId}).then(()=>{
            let message="Link has expired. Please  sign up  again ";
            res.redirect('/user/verified/error=true&message=${message}')
           }).catch(error=>{
            let message="clearing user  with expired  unique string failed";
            res.redirect('/user/verified/error=true&message=${message}')

           })       }
       ).catch((error)=>{console.log(error);
        let message="An Error  occured while cleaning expired user verification record";
        res.redirect('/user/verified/error=true&message=${message}');
      })
     
     }else{
       bcrypt.compare(uniqueString,hashedUniqueString).then(result=>{
         if(result){
           Investor.updateOne({_id:userId},{Verified:true}).then(()=>{UserVerification.deleteOne({userId}).then(()=>{res.sendFile(path.join(__dirname,"../views/verified.html"));})
           .catch(
            (error)=>{console.log(error);
              let message="An Error  occured while finalizing  successfull verification ";
              res.redirect('/user/verified/error=true&message=${message}');
            }
           )}).catch(error=>{
             console.log(error)
             let message="An Error  occured while updating user record to show  verified.";
        res.redirect('/user/verified/error=true&message=${message}');
            })
         }else{
          let message="Invalid verificaton details passed .Check your inbox .";
          res.redirect('/user/verified/error=true&message=${message}');
         }
       }).catch(error=>{
        let message="An Error  occured while comparing unique string";
        res.redirect('/user/verified/error=true&message=${message}');
       })
     }
    }else{
      let message="Account record doesn't exist or has been verified already";
res.redirect('/user/verified/error=true&message=${message}');
    }}
  ).catch((error)=>{console.log(error);
  let message="An Error  occured while cheking for existing user verification  record";
res.redirect('/user/verified/error=true&message=${message}')})

}*/

exports.loginInvestor = async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password is provided
  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }

  try {
    // Check that user exists by email
    const investor = await Investor.findOne({ email }).select("+password");

    if (!investor) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    // Check that password match
    const isMatch = await investor.matchPassword(password);

    if (!isMatch) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    sendToken(investor, 200, res);
  } catch (err) {
    next(err);
  }
};



exports.forgotpasswordInvestor =async (req, res, next) =>  {
    const{email} =req.body;
    try{
      const investor = await Investor.findOne({email});
      if (!investor){
        return next(new ErrorResponse("Email could not be sent",404))
      }
      // Reset Token Gen and add to database hashed (private) version of token
      const resetToken = investor.getResetPasswordToken();
      await investor.save();
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
      to: investor.email,
      subject: "Password Reset Request",
      text: message,
    });

    res.status(200).json({ success: true, data: "Email Sent" });
  } catch (err) {
    console.log(err);

    investor.resetPasswordToken = undefined;
    investor.resetPasswordExpire = undefined;

    await investor.save();
    return next(new ErrorResponse("Email could not be sent", 500));
  }
} catch (err) {
  next(err);
}
};
exports.resetpasswordInvestor = async(req,res,next)=>{
const resetPasswordToken = crypto
.createHash("sha256")
.update(req.params.resetToken)
.digest("hex");
try {
    const investor = await Investor.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!investor) {
      return next(new ErrorResponse("Invalid Token", 400));
    }

    investor.password = req.body.password;
    investor.resetPasswordToken = undefined;
    investor.resetPasswordExpire = undefined;

    await investor.save();

    res.status(201).json({
      success: true,
      data: "Password Reset Success"
      
    });
  } catch (err) {
    next(err);
  }

} 
const sendToken =( investor, statusCode, res)=>{
    const token =investor.getSignedToken();
res.status(statusCode).json({succes:true,token})
  }

exports.CompleteprofileInvestor = async(req,res,next)=> {
  const user = await Investor.findById(req.params.id);
  if (user) {
    user.gender = req.body.gender || user.gender;
    user.picture = req.body.picture || user.picture;
    user.description = req.body.description || user.description;
    user.birthDate = req.body.birthDate || user.birthDate;
    user.phone = req.body.phone || user.phone;
    user.Legalname= req.body.Legalname || user.Legalname;
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
      ScanCin: updateUser.ScanCin,
      Legalname: updateUser.Legalname
 
    });
  } else {
    res.status(401);
    throw new Error('User Not found');
  }
}




exports.updateInvestor = async (req, res) => {
  let newPass=bcrypt.hashSync(req.body.password,10)
  console.log(req.body.password)
  console.log(newPass)
    try {
        const { username, email, password, lastname,AmountcanInvest,picture,NumCin,ScanCin,Legalname,Typeinvestor,Minrange,Maxrange,SweetSpot,currentinvesting,Position,Company,InvestmentOnRecord,CurrentFundSize,SectorInterest} = req.body;
        await Investor.findByIdAndUpdate(req.params.id, { username, email,newPass, lastname,AmountcanInvest,picture,NumCin,ScanCin,Legalname,Typeinvestor,Minrange,Maxrange,SweetSpot,currentinvesting,Position,Company,InvestmentOnRecord,CurrentFundSize,SectorInterest})

        res.json({msg: "Update Success!"})
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
};

exports.getAllInvestor = async (req, res) => {
   
  
  Investor.find().then(investor=>{res.send(investor)}).catch(
       err=>{res.status(500).send({message:err.message || "Error Occured while retrieving user information"})}
       )
};





  exports.current_user=(req,res)=>{
	return res.status(200).send({
		message:'Current user data successfully fetched',
		data:req.user
	});
}
exports.change_password=async(req,res)=>{
	try{
		const v = new Validator(req.body, {
			old_password: 'required',
			new_password: 'required',
			confirm_password: 'required|same:new_password'
		});

		const matched = await v.check();

		if (!matched) {
			return res.status(422).send(v.errors);
		}

		let current_user=req.user;
		if(bcrypt.compareSync(req.body.old_password,current_user.password)){

			let hashPassword=bcrypt.hashSync(req.body.new_password,10);
			await User.updateOne({
				_id:current_user._id
			},{
				password:hashPassword
			});

			let userData=await User.findOne({_id:current_user._id})

			let jwt_secret=process.env.JWT_SECRET||'mysecret';
			let token=jwt.sign({
			  data: userData
			}, jwt_secret, { expiresIn: '12h' });

			return res.status(200).send({
				message:'Password successfully updated',
				data:userData,
				token:token
			});

		}else{
			return res.status(400).send({
				message:'Old password does not matched',
				data:{}
			});
		}



	}catch(err){
		return res.status(400).send({
			message:err.message,
			data:err
		});
	}

}
exports.findInvestorById =async(req,res)=>{
    const investor = await Investor.findById(req.params.id)
    res.status(200).json(investor)
  }
  

  
  // Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })
}


  exports.DeleteInvestor = async (req , res) => {
    var ObjectId = Schema.ObjectId;
    const investor = await Investor.findById(req.params.id)
    var id = new ObjectId(req.params.id);

    if (!investor) {
      res.status(400)
      throw new Error('investor not found')
    }

    await Investor.updateOne({ id: investor.id }, { Verified: false })
    res.status(200).json({id : req.params.id})
}

