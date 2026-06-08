import express from 'express';
import { getLoyaltyConfig, createLoyaltyConfig } from '../controllers/loyaltyController.js';

const router = express.Router();

router.get('/:tenantId', getLoyaltyConfig);
router.post('/', createLoyaltyConfig);

export default router;