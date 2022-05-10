const express = require('express');
const router = express.Router();

const { register, login, forgotpassword, resetpassword  } = require('../controllers/auth');
const { CompleteprofileInvestor } = require('../controllers/investor');

const {loginInvestor,verify,verified,registerInvestor,updateInvestor,getAllInvestor,DeleteInvestor,change_password,findInvestorById,resetpasswordInvestor,forgotpasswordInvestor} = require('../controllers/investor');
const{loginCreator,registerCreator,forgotpasswordCreator,resetpasswordCreator,CompleteprofileCreator,updateCreator,getAllCreator,findCreatorById,deleteCreator} = require('../controllers/creator');
const{loginDoner,getAllDoner,registerDoner,CompleteprofileDoner,updateDoner,findDonerById,DeleteDoner, forgotpasswordDoner,resetpasswordDoner} = require('../controllers/doner');
const{loginAdmin,registerAdmin} = require('../controllers/admin');
const{loginOrganizer,registerOrganizer} = require('../controllers/organizer');
router.route("/register").post(register);
router.route("/loginInvestor").post(loginInvestor);
router.route("/loginOrganizer").post(loginOrganizer);
router.route("/login").post(login);

router.route("/registerInvestor").post(registerInvestor);
router.route("/registerOrganizer").post(registerOrganizer);
router.route("/forgotpassword").post(forgotpassword);
//router.get("/verify/:userId/uniqueString",verify);
//router.get("/verified",verified);
router.route("/forgotpasswordInvestor").post(forgotpasswordInvestor);
router.route("/resetpasswordInvestor/:resetToken").put(resetpasswordInvestor);
router.put("/updateInvestor/:id",updateInvestor);
router.route("/getAllInvestor").get(getAllInvestor);
router.route("/change_password").post(change_password);
router.get('/investorId/:id' ,findInvestorById );
router.put('/deleteInvestor/:id' , DeleteInvestor);
router.route("/CompleteprofileInvestor/:id").put(CompleteprofileInvestor);
//router.route("/updateInvestorProfile").put(updateInvestorProfile);
router.route("/loginCreator").post(loginCreator);
router.route("/forgotpasswordCreator").post(forgotpasswordCreator);
router.route("/registerCreator").post(registerCreator);
router.put("/CompleteprofileCreator/:id",CompleteprofileCreator);
router.put("/updateCreator/:id",updateCreator);
router.get("/findCreatorById/:id",findCreatorById);
router.route("/getAllCreator").get(getAllCreator);
router.delete('/deleteCreator/:id' , deleteCreator);
router.route("/resetpasswordCreator/:resetToken").put(resetpasswordCreator);

//Donator
router.route("/loginDoner").post(loginDoner);
router.route("/registerDoner").post(registerDoner);
router.route("/forgotpasswordDoner").post(forgotpasswordDoner);
router.route("/resetpasswordDoner/:resetToken").put(resetpasswordDoner);
router.put("/CompleteprofileDoner/:id",CompleteprofileDoner);
router.route("/getAllDoner").get(getAllDoner);
router.put("/updateDoner/:id",updateDoner);
router.get("/findDonerById/:id",findDonerById);
router.delete("/DeleteDoner/:id",DeleteDoner);
router.route("/loginAdmin").post(loginAdmin);
router.route("/registerAdmin").post(registerAdmin);
module.exports = router;