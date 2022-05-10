const questions = require("../models/questions.model");
const validateQuestion = require("../validator/Question");
const nodemailer = require("nodemailer");
const {google} = require ('googleapis');

/* Add questions */
const Add = async (req, res) => {
  const { errors, isValid } = validateQuestion(req.body);
  try {
    if (!isValid) {
      return res.status(404).json(errors);
    } else {
      await questions.create(req.body)
      .then(async()=>{
        const data = await questions.find().populate("category", ["name"])
        res.status(201).json({
          message: "Added with success",
          data
        });

     mail= `vous avez ajouté une nouvelle question !!` 

        let transporter = nodemailer.createTransport({
          service : 'gmail', 
          auth: {
            type: 'Oauth2',
            user: 'crowdfundingpidev@gmail.com', // generated ethereal user
            clientId : process.env.CLIENT_ID, 
            clientSecret : process.env.CLIENT_SECRET,
            regreshToken : process.env.REFRESH_TOKEN, 
            accessToken : process.env.accessToken
          },
          tls:{
            rejectUnauthorized : false 
          }
        });

               // send mail with defined transport object
    let info = transporter.sendMail({
      from: '"Lancini" <crowdfundingpidev@gmail.com>', // sender address
      to: "crowdfundingpidev@gmail.com", // list of receivers
      subject: "Nouvelle question ajoutée ", // Subject line
      text: "Hello world?", // plain text body
      html: mail, // html body
    });
    
    console.log("email has been sent")


      })
    }
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

/* GetAll questions */
const GetAll = async (req, res) => {
  try {
    const data = await questions.find().populate('category', ["name"])
    res.status(201).json(data);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

/* GetOne questions */
const GetOne = async (req, res) => {
  try {
    const data = await questions.findOne({ _id: req.params.id })
    res.status(201).json(data);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

/* UpdateOne questions */
const UpdateOne = async (req, res) => {
  const { errors, isValid } = validateQuestion(req.body);
  try {
    if (!isValid) {
      return res.status(404).json(errors);
    } else {
      const data = await questions.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        { new: true }
      );
      res.status(201).json(data);
    }
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

/* DeleteOne questions */
const DeleteOne = async (req, res) => {
  try {
    await questions.deleteOne({ _id: req.params.id });
    res.status(201).json({
      message: "deleted",
    });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

module.exports = {
  Add,
  GetAll,
  GetOne,
  UpdateOne,
  DeleteOne,
};
