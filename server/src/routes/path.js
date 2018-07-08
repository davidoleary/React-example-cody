import express from 'express';

import PathController from '../controllers/PathController';

const router = express.Router();

/**
 * Retrieve
 */
router.route('/')
  .get(PathController.get);

/**
 * Create
 */
router.route('/')
  .post(PathController.post);

export default router;
