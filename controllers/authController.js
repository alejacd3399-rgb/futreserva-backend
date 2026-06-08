import { prisma } from '../lib/prisma.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || "super_secreto_futreserva"; 

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Buscar al usuario
    const user = await prisma.user.findUnique({ 
      where: { email },
      // Importante: Si el usuario es STAFF, podrías necesitar incluir su relación de TenantUser
      // Pero como el modelo User es global, busquemos también el TenantUser vinculado
    });
    
    if (!user || !user.isActive) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado o inactivo" });
    }

    // 2. Comparar contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Credenciales incorrectas" });

    // 3. Obtener el TenantUser para saber a qué complejo pertenece
    const tenantUser = await prisma.tenantUser.findFirst({
      where: { email: user.email }
    });

    // 4. Generar el Token (Incluimos tenantId si existe)
    const token = jwt.sign(
      { userId: user.id, tenantId: tenantUser?.tenantId }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );

    res.json({ 
      success: true, 
      token, 
      tenantId: tenantUser?.tenantId, // Útil para que el front sepa a qué complejo entró
      message: "Login exitoso" 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};