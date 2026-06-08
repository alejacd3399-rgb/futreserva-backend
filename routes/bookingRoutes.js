import { Router } from 'express';
// IMPORTANTE: Importamos TODAS las funciones que vamos a usar en este archivo
import { 
  createBooking, 
  getAllBookings, 
  updateBooking, 
  deleteBooking,
  getCustomerBookingCount, // <--- IMPORTANTE: Agrégalo aquí
  updateBookingStatus // <--- Agrega esto
  
} from '../controllers/bookingController.js';

const router = Router();

router.post('/', createBooking);
router.get('/', getAllBookings);
router.get('/count/:tenantId/:customerId', getCustomerBookingCount);
router.put('/:id', updateBooking);
router.delete('/:id', deleteBooking);
router.put('/:id/status', updateBookingStatus); // <--- Agrega esto

export default router;