import { prisma } from '../lib/prisma.js';

export const getLoyaltyConfig = async (req, res) => {
  try {
    const { tenantId } = req.params;
    const config = await prisma.loyaltyConfig.findFirst({
      where: { tenantId }
    });
    res.status(200).json({ success: true, data: config });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createLoyaltyConfig = async (req, res) => {
  try {
    const { tenantId, reservationsForReward, rewardDescription, isActive } = req.body;
    
    const config = await prisma.loyaltyConfig.create({
      data: { 
        tenantId, 
        reservationsForReward, // El nombre del esquema
        rewardDescription,
        isActive 
      }
    });
    res.status(201).json({ success: true, data: config });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};