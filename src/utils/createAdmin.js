import Usuario from '../models/Usuario.js';
import Rol from '../models/Rol.js';
import logger from '../middlewares/logger.js';
import validateData from './validateData.js';
import { usuarioSchema } from '../schemas/userSchema.js';


// Función encargada de crear el usuario administrador
const createAdminUser = async () => {
    try{
        // Verificamos que el admin no exista
        const admin = await Usuario.findOne({
            where: {
                correo_personal: 'omarsamuel212121@gmail.com'
            }
        });
        if(!admin){
            // Obtenemos el rol de administrador 
            const adminRole = await Rol.findOne({
                where: {nombre: 'Administrador'}
            });
            // Validamos los datos
            const newAdmin = {
                nombre: 'Samuel Omar',
                apellido: 'Boada Barrera',
                correo_personal: 'omarsamuel212121@gmail.com',
                celular: '3023023232',
                password: 'administrador1234',
                tipo: 'Administrador',
                rol_id: adminRole.id

            }
            const errors = validateData(usuarioSchema, newAdmin);
            if (errors.length > 0) throw new Error(errors.join(', '));
            // Creamos el usuario - en caso de que todo haya ido bien
            const admin = await Usuario.create({
                nombre: newAdmin.nombre,
                apellido: newAdmin.apellido,
                correo_personal: newAdmin.correo_personal,
                celular: newAdmin.celular,
                password: newAdmin.password,
                tipo: newAdmin.tipo,
                rol_id: newAdmin.rol_id
            });
            logger.info(
                { user_id: admin.id, user_name: admin.nombre, user_correo: admin.correo_personal 
                }, 'Usuario administrador creado correctamente');
        }
    }catch(error){
        logger.error(error, `Error al intentar crear usuario administrador`);
    }
};

export default createAdminUser;