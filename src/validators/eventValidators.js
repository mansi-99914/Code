const { body } = require('express-validator');

// Rules used for POST (all required fields must be present)
const createEventRules = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),

  body('date')
    .notEmpty().withMessage('Date is required')
    .isISO8601().withMessage('Date must be a valid ISO 8601 date (e.g. 2025-12-31T18:00:00)'),

  body('location')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Location cannot exceed 200 characters'),

  body('capacity')
    .optional()
    .isInt({ min: 1 }).withMessage('Capacity must be a positive integer'),

  body('status')
    .optional()
    .isIn(['upcoming', 'ongoing', 'completed', 'cancelled'])
    .withMessage('Status must be one of: upcoming, ongoing, completed, cancelled'),
];

// Rules used for PATCH (all fields optional — only validate if provided)
const updateEventRules = [
  body('title')
    .optional()
    .trim()
    .notEmpty().withMessage('Title cannot be empty')
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),

  body('date')
    .optional()
    .isISO8601().withMessage('Date must be a valid ISO 8601 date'),

  body('location')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Location cannot exceed 200 characters'),

  body('capacity')
    .optional()
    .isInt({ min: 1 }).withMessage('Capacity must be a positive integer'),

  body('status')
    .optional()
    .isIn(['upcoming', 'ongoing', 'completed', 'cancelled'])
    .withMessage('Status must be one of: upcoming, ongoing, completed, cancelled'),
];

module.exports = { createEventRules, updateEventRules };
