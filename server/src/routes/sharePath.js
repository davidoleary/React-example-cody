import express from 'express';

import ShareDrivePathController from '../controllers/ShareDrivePathController';

const router = express.Router();

/**
 * Retrieve
 */
router.route('/')
  .get(ShareDrivePathController.get);

/**
 * Create
 */
router.route('/')
  .post(ShareDrivePathController.post);

export default router;
