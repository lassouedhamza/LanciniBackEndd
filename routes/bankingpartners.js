const  express = require('express');
const { getBankingPartner ,getBankingPartners, createBankingPartners  , updateBankingPartners, deleteBankingPartners} = require( '../controllers/bankingpartners.js');

const router = express.Router();


router.get('/', getBankingPartners);
router.post('/', createBankingPartners);
router.get('/:id', getBankingPartner);
router.patch('/:id', updateBankingPartners);
router.delete('/:id', deleteBankingPartners);

module.exports= router
 