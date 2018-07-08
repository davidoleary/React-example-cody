import express from 'express';

import BarcodeController from '../controllers/BarcodeController';

const router = express.Router();

/**
 * Retrieve individual edition
 */
router.route('/:id')
  .get(BarcodeController.get);

export default router;
