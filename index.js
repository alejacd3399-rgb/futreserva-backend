import express from 'express';
import cors from 'cors';
import tenantRoutes from './routes/tenantRoutes.js';
import fieldRoutes from './routes/fieldRoutes.js'; 
import authRoutes from './routes/authRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import userRoutes from './routes/userRoutes.js'; 
import customerRoutes from './routes/customerRoutes.js';
import tenantUserRoutes from './routes/tenantUserRoutes.js';
import loyaltyRoutes from './routes/loyaltyRoutes.js';

const app = express();

// Middlewares
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }));

// Logging middleware (movido arriba para que loguee todo)
app.use((req, res, next) => {
  console.log(`[LOG]: Petición recibida: ${req.method} ${req.url}`);
  next();
});

// Rutas
app.use('/api/tenants', tenantRoutes);
app.use('/api/fields', fieldRoutes); 
app.use('/api/users', userRoutes); 
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/tenant-users', tenantUserRoutes);
app.use('/api/loyalty-configs', loyaltyRoutes);

app.get('/', (req, res) => {
  res.send('⚽ ¡Servidor de FutReserva corriendo localmente con éxito! 🚀');
});

// Servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor encendido en: http://localhost:${PORT}`);
});