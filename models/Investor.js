const mongoose = require('mongoose');
const crypto = require("crypto");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { stringify } = require('querystring');




const InvestorSchema = new mongoose.Schema({
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
      NumCin:Number,
      ScanCin:String,
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
    country:{
      type:String,
      //required: [true, "Please provide a country"],
      enum:["ariana","beja" ,"benarous","bizerte","gabes","gafsa","jendouba","Nabeul","kairouan","kasserine","kebili","kef","mahdia","manouba","mednine","monastir","nabeul","sfax","sidi bouzid","silliana","sousse","tataouine","tozeur","Sousse","zaghouan"],
    },
    postalCode:Number,
    picture: { type: String },
   
  description:String,
  SectorInterest : {
    type:String,
    enum:['HealthIT', 'Technology','DataServices', 'Hardware', 'E-commerce', 'Space',
    'AudioTech', 'Messaging', 'Enterprise', 'Analytics',
    'Parenting/Families', 'Lodging/Hospitality', 'GigEconomy',
    'HumanCapital/HRTech', 'TransportationTech', 'Security',
    'Direct-to-Consumer(DTC)', 'SMBSoftware', 'Education',
    'ConsumerInternet', 'Impact', 'RealEstate/PropTech',
    'ClimateTech/CleanTech', 'DeveloperTools', 'EnterpriseApplications',
    'Entertainment&Sports', 'FutureofWork', 'ConsumerHealth',
    'DigitalHealth', 'Travel', 'SocialNetworks', 'AR/VR', 'Pharmaceuticals',
    'Fashion', 'ConstructionTech', 'Health&HospitalServices', 'AutoTech',
    'Payments', 'CloudInfrastructure', 'Marketplaces',
    'EnterpriseInfrastructure', 'Chemicals', 'Semiconductors',
    'Gaming/eSports', 'Crypto/Web3', 'LegalTech', 'Games', 'Mobility',
    'AgTech', 'Insurance', 'LocalServices', 'FoodandBeverage',
    'SocialCommerce', 'Sales&CRM', 'MedicalDevices', 'MarketingTech', 'IoT',
    'Retail', 'MaterialScience', 'Creator/PassionEconomy', 'EnergyTech',
    'Robotics', 'GovTech', 'Cybersecurity', 'AI', 'BioTech', 'DeepTech',
    'Manufacturing', 'Web3/Blockchain', 'SaaS', 'FinTech', 'Media/Content',
    'DrugDelivery', 'Cosmetics', 'Advertising']
},
valid : {

  type : Boolean, 
  default : false
}, 
category:{
  type:String,
  enum:['VC','CEO','Investor','Angel']
},
round:{
  type:String,
  enum:['seed','pressed','seriea','serieb']
},
AmountcanInvest:Number,
Typeinvestor: {
  type:String,
  enum:["Physique","Morale"]
},
currentinvesting:Number,
Position:String,
Range:Number,
Company:String,
InvestmentOnRecord:Number,
CurrentFundSize:Number,
Minrange:Number,
Maxrange:Number,
SweetSpot:Number,
Verified: {

  type : Boolean, 
  default :true
},
Legalname:String});
InvestorSchema.pre("save",async function(next) {
    if(!this.isModified("password")){
      next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt)
    next();
  });
  InvestorSchema.methods.matchPassword = async function(password){
    return await bcrypt.compare(password,this.password);
  };
  InvestorSchema.methods.getSignedToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{expiresIn: process.env.JWT_EXPIRE});
  }
  InvestorSchema.methods.getResetPasswordToken = function () {
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

  
  const Investor = mongoose.model("Investor",InvestorSchema)
  module.exports = Investor;