import { Router } from 'express';

import { 
  createTenant, 
  getTenants, 
  getTenantBySlug, // <-- Asegúrate de importar la nueva función
  updateTenant, 
  deleteTenant 
} from '../controllers/tenantController.js';

const router = Router();


router.post('/', createTenant);        // Crear
router.get('/', getTenants);           // Listar
router.get('/:slug', getTenantBySlug);
router.put('/:id', updateTenant);      // Actualizar
router.delete('/:id', deleteTenant);   // Borrar (borrado lógico)

export default router;