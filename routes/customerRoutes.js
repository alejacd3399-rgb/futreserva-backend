import { Router } from 'express';
// Asegúrate de importar los nombres correctos que existen en el controlador
import { 
  createOrUpdateCustomer, 
  getCustomersByTenant, 
  updateCustomer, 
  deleteCustomer 
} from '../controllers/customerController.js';

const router = Router();

// Aquí debes usar los mismos nombres que importaste arriba
router.post('/', createOrUpdateCustomer);         // Cambio: de createCustomer a createOrUpdateCustomer
router.get('/:tenantId', getCustomersByTenant);   // Cambio: ahora recibe tenantId
router.put('/:id', updateCustomer);               // Esto está bien
router.delete('/:id', deleteCustomer);            // Esto está bien

export default router;