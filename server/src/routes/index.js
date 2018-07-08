import express from 'express';
import barcode from './barcode';
import sharePath from './sharePath';

const router = express.Router();


router.use('/v1/barcode', barcode);
router.use('/v1/path', sharePath);

export default router;
