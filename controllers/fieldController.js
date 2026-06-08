import { prisma } from '../lib/prisma.js';

// 1. Registrar una cancha
export const createField = async (req, res) => {
  try {
    const { name, fieldType, pricePerHour, surface, tenantId } = req.body;

    const newField = await prisma.field.create({
      data: { 
        name, 
        fieldType, 
        pricePerHour, 
        surface, 
        tenantId // Pasamos el ID directamente, más eficiente que el connect
      }
    });
    
    res.status(201).json({ success: true, data: newField });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 2. Obtener canchas (SIEMPRE filtrado por tenantId)
export const getFieldsByTenant = async (req, res) => {
  try {
    const { tenantId } = req.params;
    
    const fields = await prisma.field.findMany({
      where: { 
        tenantId, 
        deletedAt: null // Cumpliendo política de Soft Delete (Pág 1)
      }
    });
    res.status(200).json({ success: true, data: fields });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 3. Actualizar una cancha
export const updateField = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, fieldType, pricePerHour, surface } = req.body;
    
    const updatedField = await prisma.field.update({
      where: { id },
      data: { name, fieldType, pricePerHour, surface }
    });
    
    res.status(200).json({ success: true, data: updatedField });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 4. Borrar una cancha (Soft Delete - Pág 1)
export const deleteField = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.field.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
    res.status(200).json({ success: true, message: "Cancha dada de baja correctamente" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};