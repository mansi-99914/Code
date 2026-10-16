const express = require('express');
const router = express.Router();

const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} = require('../controllers/eventController');

const { createEventRules, updateEventRules } = require('../validators/eventValidator');

// GET /api/events       → list all events (supports ?status= query)
// POST /api/events      → create a new event
router.route('/').get(getAllEvents).post(createEventRules, createEvent);

// GET /api/events/:id   → get single event
// PATCH /api/events/:id → partial update
// DELETE /api/events/:id → delete
router
  .route('/:id')
  .get(getEventById)
  .patch(updateEventRules, updateEvent)
  .delete(deleteEvent);

module.exports = router;
