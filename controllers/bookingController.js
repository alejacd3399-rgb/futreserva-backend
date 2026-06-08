import { prisma } from '../lib/prisma.js';

// ... (El resto de funciones como checkLoyalty se mantienen igual)

export const createBooking = async (req, res) => {
  try {
    const { 
      tenantId, fieldId, customerId, createdBy, 
      reservationDate, startTime, endTime, durationMinutes, totalAmount 
    } = req.body;

    const resDate = new Date(reservationDate);
    
    // 1. NUEVA VALIDACIÓN: Fechas pasadas
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (resDate < today) {
      return res.status(400).json({ success: false, message: "No puedes reservar en fechas pasadas." });
    }

    // 2. VALIDACIÓN DE DISPONIBILIDAD
    const conflict = await prisma.booking.findFirst({
      where: {
        fieldId,
        reservationDate: resDate,
        status: 'confirmed',
        deletedAt: null,
        startTime: { lt: endTime },
        endTime: { gt: startTime }
      }
    });

    if (conflict) {
      return res.status(409).json({ success: false, message: "La cancha ya tiene una reserva confirmada." });
    }

    const isReward = await checkLoyalty(tenantId, customerId);

    const newBooking = await prisma.booking.create({
      data: {
        tenantId, fieldId, customerId, createdBy,
        reservationDate: resDate, startTime, endTime, durationMinutes,
        totalAmount: isReward ? 0 : totalAmount,
        status: 'confirmed',
        paymentStatus: 'unpaid'
      }
    });
    
    return res.status(201).json({ success: true, data: newBooking, isReward });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus, tenantId } = req.body; // Recibimos tenantId para validar

    // Validación de seguridad: Asegurar que pertenece al tenant
    const booking = await prisma.booking.findFirst({ where: { id, tenantId } });
    if (!booking) return res.status(404).json({ success: false, message: "Reserva no encontrada o sin permiso" });

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: { status, paymentStatus }
    });

    return res.status(200).json({ success: true, data: updatedBooking });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const { tenantId, startDate, endDate } = req.query; 

    if (!tenantId) return res.status(400).json({ success: false, message: "El tenantId es requerido" });

    const whereClause = { 
      tenantId, 
      deletedAt: null 
    };

    // Filtro de rango de fechas añadido
    if (startDate && endDate) {
      whereClause.reservationDate = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      };
    }

    const bookings = await prisma.booking.findMany({
      where: whereClause,
      include: {
        customer: { select: { fullName: true } },
        field: { select: { name: true } },
        creator: { select: { fullName: true } }
      }
    });

    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { reservationDate, status, totalAmount, tenantId } = req.body;
    
    const booking = await prisma.booking.findFirst({ where: { id, tenantId } });
    if (!booking) return res.status(404).json({ success: false, message: "No autorizada" });
    
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: { 
        reservationDate: reservationDate ? new Date(reservationDate) : undefined,
        status, totalAmount
      } 
    });
    res.status(200).json({ success: true, data: updatedBooking });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenantId } = req.body; // Asegúrate de enviarlo desde el front
    
    const booking = await prisma.booking.findFirst({ where: { id, tenantId } });
    if (!booking) return res.status(404).json({ success: false, message: "No autorizada" });

    await prisma.booking.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
    res.status(200).json({ success: true, message: "Reserva cancelada" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getCustomerBookingCount = async (req, res) => {
  try {
    const { tenantId, customerId } = req.params;
    const count = await prisma.booking.count({
      where: { tenantId, customerId, status: 'confirmed', deletedAt: null }
    });
    res.status(200).json({ success: true, confirmedBookingsCount: count });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};