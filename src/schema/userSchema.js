import z from "zod";
import validateData from "../util/validateData.js";

//esquema para usuario
export const usuarioSchema = z
  .object({
    body: z
      .object({
        nombre: z
          .string({
            invalid_type_error: "El nombre solo puede ser texto",
            required_error: "El nombre es requerido",
          })
          .min(2, { message: "El nombre es muy corto" })
          .max(15, {
            message: "El nombre supera la cantidad de caracteres permitidos",
          }),
        apellido: z
          .string({
            invalid_type_error: "El apellido solo puede ser texto",
            required_error: "El apellido es requerido",
          })
          .min(2, { message: "El apellido es muy corto" })
          .max(15, {
            message: "El apellido supera la cantidad de caracteres permitidos",
          }),
        correo_personal: z
          .string({
            invalid_type_error: "El email personal solo puede ser texto",
          })
          .email({ message: "El formato del email personal es incorrecto" }),
        celular: z
          .string({
            invalid_type_error: "El celular solo puede ser texto",
          })
          .length(10, { message: "El celular solo puede tener 10 digitos" })
          .refine((value) => /^[0-9]+$/.test(value), {
            message: "El celular debe contener solo números",
          }),
        password: z
          .string({
            invalid_type_error: "La contraseña solo puede ser texto",
            required_error: "La contraseña es requerida",
          })
          .min(8, { message: "La contraseña es muy corta" })
          .max(30, {
            message: "La contraseña excede la cant. maxima de caracteres",
          }),
        tipo: z
          .string({
            invalid_type_error: "El tipo de usuario solo puede ser texto",
            required_error: "El tipo de usuario es requerido",
          })
          .refine(
            (value) =>
              ["Administrador", "Asegurador", "Inversor"].includes(value),
            {
              message:
                'El tipo de usuario debe ser "Administrador", "Asegurador" o "Inversor"',
            }
          ),
        rol_id: z
          .number({
            invalid_type_error: "El identicador del rol debe ser un numero",
            required_error: "El identificador del rol es requerido",
          })
          .min(1, {
            message: "El identificador del rol no debe ser 0 o negativo",
          }),
      })
      .partial(),
    params: z
      .object({
        id: z
          .string({
            required_error: "El identificador del usuario es necesario",
          })
          .regex(/^[0-9]+$/, "Req no válido"),
      })
      .partial(),
  })
  .partial();

// Esquema de inicio de sesión
const loginSchema = z
  .object({
    correo_institucional: z
      .string({
        invalid_type_error: "El email solo puede ser texto",
      })
      .email({ message: "El formato del email es incorrecto" }),
    password: z
      .string({
        invalid_type_error: "La contraseña solo puede ser texto",
      })
      .regex(
        new RegExp(/^(?!select|update|delete)/i),
        "Formato de password no valido"
      ),
  })
  .strict();

export function validateLoginData(req, res, next) {
  const errors = validateData(loginSchema, req.body);
  if (errors.length !== 0) return res.status(400).json({ error: errors });
  next();
}

export function validateUserData(req, res, next) {
  const errors = validateData(usuarioSchema, req);
  if (errors.length !== 0) return res.status(400).json({ error: errors });
  next();
}
