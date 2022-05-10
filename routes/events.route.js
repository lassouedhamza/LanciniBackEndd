const express = require("express");
const router = express.Router();
const EventController = require('../controllers/event.controller');

router.get(`/`, EventController.getEventList);

router.get(`/:id`, EventController.getEventById);



// router.get(`/daterange`, EventController.getEventsByDaterange);

router.delete(`/delete/:id`, EventController.deleteEvent);

router.post(`/add`, EventController.addEvent);

router.post(`/update/:id`, EventController.updateEvent);

module.exports = router;

