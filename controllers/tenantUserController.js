import { prisma } from '../lib/prisma.js';

export const assignUserToTenant = async (req, res) => {
  try {
    // Ajustado a los nombres exactos de tu modelo
    const { tenantId, stackAuthId, email, fullName, role } = req.body;
    
    const assignment = await prisma.tenantUser.create({
      data: { 
        tenantId, 
        stackAuthId, 
        email, 
        fullName, 
        role // Prisma usará el Enum TenantUserRole
      }
    });
    
    res.status(201).json({ success: true, data: assignment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Asegúrate de que este export exista en controllers/tenantUserController.js
export const getUsersByTenant = async (req, res) => {
  try {
    const { tenantId } = req.params;
    const users = await prisma.tenantUser.findMany({ 
      where: { tenantId } 
    });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};