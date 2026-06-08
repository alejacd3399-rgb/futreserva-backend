import express from 'express';
import { 
    assignUserToTenant, 
    getUsersByTenant 
} from '../controllers/tenantUserController.js';

const router = express.Router();

// Ruta para asignar un usuario a un tenant (ej: POST /api/tenant-users)
router.post('/', assignUserToTenant);

// Ruta para listar todos los empleados de un tenant específico (ej: GET /api/tenant-users/123)
router.get('/:tenantId', getUsersByTenant);

export default router;