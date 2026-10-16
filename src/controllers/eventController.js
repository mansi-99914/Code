const { validationResult } = require('express-validator');
const Event = require('../models/Event');

// ─── Helper ────────────────────────────────────────────────────────────────────
// Checks express-validator result and sends 400 if there are errors
const validate = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ success: false, errors: errors.array() });
    return false;
  }
  return true;
};

// ─── GET /api/events ──────────────────────────────────────────────────────────
// Returns all events, newest first. Supports ?status= filter.
const getAllEvents = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const events = await Event.find(filter).sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ─── GET /api/events/:id ──────────────────────────────────────────────────────
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    res.status(200).json({ success: true, data: event });
  } catch (error) {
    // Invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid event ID format' });
    }
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ─── POST /api/events ─────────────────────────────────────────────────────────
const createEvent = async (req, res) => {
  if (!validate(req, res)) return;

  try {
    const { title, description, date, location, capacity, status } = req.body;

    const event = await Event.create({ title, description, date, location, capacity, status });

    res.status(201).json({ success: true, data: event });
  } catch (error) {
    // Mongoose validation errors (schema-level)
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, errors: messages });
    }
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ─── PATCH /api/events/:id ────────────────────────────────────────────────────
const updateEvent = async (req, res) => {
  if (!validate(req, res)) return;

  try {
    // Only pick allowed fields from the body (prevents mass-assignment)
    const { title, description, date, location, capacity, status } = req.body;
    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (date !== undefined) updates.date = date;
    if (location !== undefined) updates.location = location;
    if (capacity !== undefined) updates.capacity = capacity;
    if (status !== undefined) updates.status = status;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, message: 'No valid fields provided for update' });
    }

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,           // return the updated document
        runValidators: true, // run schema validators on update
      }
    );

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    res.status(200).json({ success: true, data: event });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid event ID format' });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, errors: messages });
    }
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ─── DELETE /api/events/:id ───────────────────────────────────────────────────
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    res.status(200).json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid event ID format' });
    }
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent };
