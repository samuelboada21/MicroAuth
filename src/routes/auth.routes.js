import { Router } from 'express';
import { validateLoginData, validateUserData} from '../schemas/userSchema.js';

// Importamos las funciones del controlador
import { login, logout, refresh, register, verifyPermits } from '../controllers/authController.js';

// Middlewares
import verifyJWT from '../middlewares/verifyJWT.js';
import extractToken from '../middlewares/extractToken.js';
import limiter from '../middlewares/rateLimit.js';

// Inicializamos el router
const router = Router();
// Routes

// @desc Endpoint encargado de la administración del Login de usuario
// @route POST /api/auth/login
// @access public
router.post('/login', [limiter, validateLoginData], login); //probado

// @desc Enpoint encargado de realizar el refresco del token de acceso
// @route GET /api/auth/refresh
// @access public - token de refresco expirado
router.get('/refresh', refresh);

// @desc Enpoint encargado de gestionar el cierre de sesión
// @route POST /api/auth/logout
// @access only Users 
router.post('/logout', [extractToken, verifyJWT], logout);

// @desc Enpoint encargado del registro de un usuario nuevo
// @route POST /api/auth/register
// @access public
router.post('/register', [limiter, validateUserData], register); //probado

// @desc Enpoint encargado de enviar el rol del usuario
// @route POST /api/auth/verifyPermits
// @access public
router.post('/verifyPermits', [extractToken, verifyJWT], verifyPermits); //

// Exportamos el router
export default router;