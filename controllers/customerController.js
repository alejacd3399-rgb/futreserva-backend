import { prisma } from '../lib/prisma.js';

export const createOrUpdateCustomer = async (req, res) => {
  try {
    const { tenantId, phone, fullName, email } = req.body;

    // Cumpliendo el Objetivo 3: Transacción atómica
    // UPSERT: Si el tenantId + phone ya existe, incrementamos el conteo. 
    // Si no, lo creamos.
    const customer = await prisma.customer.upsert({
      where: {
        uidx_tenant_customer_phone: {
          tenantId: tenantId,
          phone: phone,
        },
      },
      update: {
        reservationsCount: { increment: 1 },
      },
      create: {
        tenantId,
        phone,
        fullName,
        email,
        reservationsCount: 1, // Primera reserva
      },
    });

    res.status(200).json({ success: true, data: customer });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getCustomersByTenant = async (req, res) => {
  try {
    const { tenantId } = req.params;

    // Filtro estricto por tenantId y borrado lógico
    const customers = await prisma.customer.findMany({
      where: { 
        tenantId: tenantId,
        deletedAt: null 
      },
      orderBy: { fullName: 'asc' }
    });

    res.status(200).json({ success: true, data: customers });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Agrega estas funciones a tu controlador actual:

export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email, phone } = req.body;
    const updated = await prisma.customer.update({
      where: { id },
      data: { fullName, email, phone }
    });
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    // Aplicando borrado lógico según el documento
    await prisma.customer.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
    res.status(200).json({ success: true, message: "Cliente dado de baja" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};