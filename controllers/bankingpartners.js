const express= require( 'express');
const mongoose =require("mongoose");

const bankingpartners = require( '../models/bankingpartners.js');



 const getBankingPartners = async (req, res) => { 
    try {
        const banking_partners = await bankingpartners.find();
                
        res.status(200).json(banking_partners);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

 const getBankingPartner = async (req, res) => { 
    const { id } = req.params;

    try {
        const banking_partners = await bankingpartners.findById(id);
        
        res.status(200).json(banking_partners);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

 const createBankingPartners = async (req, res) => {
    const { bank_name, description ,offer , email  , bankImage } = req.body;
 
    const newbankingpartner = new bankingpartners({ bank_name, description  , offer , email , bankImage })

    try {
        await newbankingpartner.save();

        res.status(201).json(newbankingpartner );
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

 const updateBankingPartners = async (req, res) => {
    const { id } = req.params;
    const { bank_name, description , offer , email  , bankImage  } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    const updateBankingPartners = { bank_name, description  , offer , email , bankImage  , _id: id };

    await bankingpartners.findByIdAndUpdate(id, updateBankingPartners, { new: true });

    res.json(updateBankingPartners);
}

 const deleteBankingPartners = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No event with id: ${id}`);

    await bankingpartners.findByIdAndRemove(id);

    res.json({ message: "Banking deleted successfully." });
}
module.exports = {
    getBankingPartners,
    getBankingPartner,
    createBankingPartners,
    updateBankingPartners,
    deleteBankingPartners,
   
  };