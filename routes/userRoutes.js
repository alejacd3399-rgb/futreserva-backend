import { Router } from 'express';
// Importamos todas las funciones necesarias
import { 
  registerUser, 
  getAllUsers, 
  updateUser, 
  deleteUser 
} from '../controllers/userController.js';

const router = Router();

// Rutas de Usuarios
router.post('/register', registerUser); // Crear usuario
router.get('/', getAllUsers);           // Obtener todos
router.put('/:id', updateUser);         // Actualizar usuario
router.delete('/:id', deleteUser);      // Eliminar usuario

export default router;