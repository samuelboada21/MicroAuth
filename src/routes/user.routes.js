import { Router } from 'express';
// Middleware de verificación de token
import extractToken from '../middlewares/extractToken.js';
import verifyJWT from '../middlewares/verifyJWT.js';
import isAdmin from '../middlewares/isAdmin.js';
import { validateUserData } from '../schemas/userSchema.js'
// Importamos las funciones del controlador
import userController from '../controllers/userController.js';

// Inicializamos el router
const router = Router();

// Routes

// @desc Endpoint encargado de la obtención del perfil de cada usuario
// @route GET /api/user/profile
// @access solo Usuarios
router.get('/profile', [ extractToken, verifyJWT ], userController.getProfile); //probado

// @desc Endpoint encargado de la obtención de todos los usuarios
// @route GET /api/user/usuarios
// @access solo Admin
router.get('/usuarios', [ extractToken, verifyJWT, isAdmin, validateUserData], userController.getUsuarios);//probado

// @desc Endpoint encargado de la obtención de un solo usuario por su id
// @route GET /api/user/usuario/:id
// @access Docente
router.get('/usuario/:id', [ extractToken, verifyJWT, isAdmin, validateUserData ], userController.getUsuarioById);//probado

// @desc Endpoint encargado de la actualización de datos de un docente por parte del director
// @route PUT /api/user/usuario/update/:id
// @access solo Admin
router.put('/usuario/update/:id', [ extractToken, verifyJWT, isAdmin, validateUserData ], userController.updateRolUser);//probado

// Importamos el router
export default router;