import express from 'express';
import ah from 'express-async-handler';

import { reply } from 'controllers/app-reply';
import { requireAuthenticated } from 'middleware/authMiddleware';
import { NotFound } from 'controllers/errors';

import { VenueModel } from 'db/models/venue';
import { VenueDecorationModel } from 'db/models/venueDecoration';
import { validateJoi } from 'middleware/validateJoi';
import joi from 'joi';

export const router = express.Router();

// Create Venue
router.post(
  '/venues',
  requireAuthenticated(),
  validateJoi(
    joi.object({
      name: joi.string().required(),
      description: joi.string().optional(),
      addressCountry: joi.string().required(),
      addressCity: joi.string().required(),
      addressArea: joi.string().required(),
      addressZip: joi.string().required(),
      price: joi.number().optional(),
      openAtTiming: joi.string().optional(),
      openAtDays: joi.string().optional(),
      imagePath: joi.string().optional(),
      renderPath: joi.string().optional(),
    })
  ),
  ah(async (req, res) => {
    const venue = new VenueModel({ ...req.body });
    await venue.save();
    return reply(res, venue);
  })
);

// Get All Venues
router.get(
  '/venues',
  requireAuthenticated(),
  ah(async (req, res) => {
    const venues = await VenueModel.find().populate('decorations');
    return reply(res, venues);
  })
);

// Get Single Venue
router.get(
  '/venue/:venueId',
  requireAuthenticated(),
  ah(async (req, res) => {
    const { venueId } = req.params;
    const venue = await VenueModel.findById(venueId).populate('decorations');
    if (!venue) throw new NotFound();
    return reply(res, venue);
  })
);

// Update Venue
router.put(
  '/venue/:venueId',
  requireAuthenticated(),
  validateJoi(
    joi.object({
      name: joi.string().optional(),
      description: joi.string().optional(),
      addressCountry: joi.string().optional(),
      addressCity: joi.string().optional(),
      addressArea: joi.string().optional(),
      addressZip: joi.string().optional(),
      price: joi.number().optional(),
      openAtTiming: joi.string().optional(),
      openAtDays: joi.string().optional(),
      imagePath: joi.string().optional(),
      renderPath: joi.string().optional(),
      isActive: joi.boolean().optional(),
    })
  ),
  ah(async (req, res) => {
    const { venueId } = req.params;
    const updated = await VenueModel.findByIdAndUpdate(venueId, req.body, { new: true });
    if (!updated) throw new NotFound();
    return reply(res, updated);
  })
);

// Delete Venue
router.delete(
  '/venue/:venueId',
  requireAuthenticated(),
  ah(async (req, res) => {
    const { venueId } = req.params;
    const deleted = await VenueModel.findByIdAndDelete(venueId);
    if (!deleted) throw new NotFound();
    return reply(res, { success: true });
  })
);

router.post(
  '/venue-decorations',
  requireAuthenticated(),
  validateJoi(
    joi.object({
      venueId: joi.string().required(), // must be a valid ObjectId
      name: joi.string().required(),
      description: joi.string().optional(),
      price: joi.number().optional(),
      imagePath: joi.string().optional(),
      renderPath: joi.string().optional(),
      isActive: joi.boolean().optional(),
    }),
  ),
  ah(async (req, res) => {
    const {
      venueId,
      name,
      description,
      price,
      imagePath,
      renderPath,
      isActive,
    } = req.body;

    const decoration = new VenueDecorationModel({
      venueId,
      name,
      description,
      price,
      imagePath,
      renderPath,
      isActive,
    });

    await decoration.save();

    return reply(res, decoration);
  }),
);

// Get Single Venue Decoration
router.get(
  '/venue-decoration/:venueDecorationId',
  requireAuthenticated(),
  ah(async (req, res) => {
    const { venueDecorationId } = req.params;
    const venueDecoration = await VenueDecorationModel.findById(venueDecorationId).populate('venue');
    if (!venueDecoration) throw new NotFound();
    return reply(res, venueDecoration);
  })
);

// Update Venue Decoration
router.put(
  '/venue-decoration/:venueDecorationId',
  requireAuthenticated(),
  validateJoi(
    joi.object({
      name: joi.string().optional(),
      description: joi.string().optional(),
      price: joi.number().optional(),
      imagePath: joi.string().optional(),
      renderPath: joi.string().optional(),
      isActive: joi.boolean().optional(),
    })
  ),
  ah(async (req, res) => {
    const { venueDecorationId } = req.params;
    const updated = await VenueDecorationModel.findByIdAndUpdate(venueDecorationId, req.body, { new: true });
    if (!updated) throw new NotFound();
    return reply(res, updated);
  })
);

// Delete Venue Decoration
router.delete(
  '/venue-decoration/:venueDecorationId',
  requireAuthenticated(),
  ah(async (req, res) => {
    const { venueDecorationId } = req.params;
    const deleted = await VenueDecorationModel.findByIdAndDelete(venueDecorationId);
    if (!deleted) throw new NotFound();
    return reply(res, { success: true });
  })
);
