import { prisma } from '../lib/prisma.js';
import bcrypt from 'bcrypt';

// 1. Registro de Usuario (Global)
export const registerUser = async (req, res) => {
  try {
    const { email, password, fullName } = req.body;

    // Validación básica de seguridad
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "La contraseña debe tener al menos 6 caracteres" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName
      }
    });

    res.status(201).json({ 
      success: true, 
      message: "¡Usuario registrado con éxito!", 
      data: { id: newUser.id, email: newUser.email, fullName: newUser.fullName }
    });
  } catch (error) {
    // Manejo de error específico si el email ya existe (P2002)
    if (error.code === 'P2002') {
      return res.status(409).json({ success: false, message: "El correo electrónico ya está registrado" });
    }
    res.status(500).json({ success: false, error: error.message });
  }
};

// 2. Borrado lógico (Siguiendo política de integridad de la Pág 1)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificamos si existe antes de borrar
    const user = await prisma.user.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false } // Desactivamos también el flag isActive
    });
    
    res.status(200).json({ success: true, message: "Usuario dado de baja correctamente" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 3. Obtener todos los usuarios activos
export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { 
        deletedAt: null,
        isActive: true // Filtro adicional de integridad
      }, 
      select: { id: true, email: true, fullName: true, createdAt: true }
    });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 4. Actualización
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, fullName } = req.body;
    
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { email, fullName }
    });
    
    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};