import express from 'express';

import { getEvents, getEvent, createEvent, updateEvent, deleteEvent } from '../controllers/events.js';

const router = express.Router();

router.get('/', getEvents);
router.post('/', createEvent);
router.get('/:id', getEvent);
router.patch('/:id', updateEvent);
router.delete('/:id', deleteEvent);
//router.patch('/:id/likePost', likePost);

export default router;