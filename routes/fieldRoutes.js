import { Router } from 'express';
import { 
    createField, 
    //getAllFields, 
    getFieldsByTenant, 
    updateField, 
    deleteField 
} from '../controllers/fieldController.js';

const router = Router();

router.post('/', createField);
router.get('/:tenantId', getFieldsByTenant);
router.get('/tenant/:tenantId', getFieldsByTenant);
router.put('/:id', updateField);
router.delete('/:id', deleteField);

export default router;