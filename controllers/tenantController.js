import { prisma } from '../lib/prisma.js';

// 1. Registrar un complejo deportivo (Tenant)
export const createTenant = async (req, res) => {
  try {
    const { businessName, slug, nit, phone, email, address } = req.body;

    const newTenant = await prisma.tenant.create({
      data: {
        businessName,
        slug, // Prisma validará el @unique de tu schema
        nit,
        phone,
        email,
        address
      }
    });

    res.status(201).json({
      success: true,
      message: "¡Complejo deportivo registrado con éxito!",
      data: newTenant
    });
  } catch (error) {
    // Si el error es por un slug duplicado, Prisma lanzará P2002
    if (error.code === 'P2002') {
      return res.status(409).json({ success: false, message: "El slug ya existe, elija otro." });
    }
    res.status(500).json({ success: false, error: error.message });
  }
};

// 2. Obtener todos los complejos (Solo los activos)
export const getTenants = async (req, res) => {
  try {
    const tenants = await prisma.tenant.findMany({
      where: { deletedAt: null } // Cumpliendo Pág 1: Borrado lógico
    });
    res.status(200).json({ success: true, data: tenants });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 3. Actualizar datos de un complejo
export const updateTenant = async (req, res) => {
  try {
    const { id } = req.params;
    const { businessName, slug, nit, phone, email, address } = req.body;
    
    const updatedTenant = await prisma.tenant.update({
      where: { id },
      data: { businessName, slug, nit, phone, email, address }
    });
    
    res.status(200).json({ success: true, data: updatedTenant });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 4. Borrar un complejo (Borrado lógico - Pág 1)
export const deleteTenant = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Al hacer borrado lógico, el complejo ya no aparecerá en getTenants
    await prisma.tenant.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
    
    res.status(200).json({ success: true, message: "Complejo dado de baja correctamente" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 5. Obtener un complejo por su SLUG (para el login)
export const getTenantBySlug = async (req, res) => {
  try {
    const { slug } = req.params; // El slug viene de la URL
    
    const tenant = await prisma.tenant.findUnique({
      where: { slug: slug }
    });
    
    if (!tenant) {
      return res.status(404).json({ success: false, message: "Complejo no encontrado" });
    }
    
    res.status(200).json(tenant);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

