
import { Router } from 'express';
import { pagosController } from '../controllers/index.js';

const router = Router();

// Endpoint totalmente público para recibir los eventos asíncronos de la pasarela
router.post('/webhook-notificacion', pagosController.registrarIntentoPago);

export default router;
