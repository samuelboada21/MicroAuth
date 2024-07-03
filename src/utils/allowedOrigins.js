import dotenv from 'dotenv';

// Carga las variables de entorno desde el archivo .env
dotenv.config();

// Lee y procesa la variable ALLOWED_ORIGINS desde el archivo .env
const allowedOriginsEnv = process.env.ALLOWED_ORIGINS || '';
const allowedOrigins = allowedOriginsEnv.split(',').map(origin => origin.trim());

console.log(allowedOrigins);

export { allowedOrigins };
