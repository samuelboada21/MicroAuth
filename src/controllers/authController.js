import Usuario from "../models/Usuario.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

/* --------- Login function -------------- */
export const login = async (req, res, next) => {
  try {
    // Obtenemos las credenciales del usuario
    const { correo_personal, password } = req.body;
    // Verificamos la existencia del usuario
    const userFound = await Usuario.findOne({
      where: {
        correo_personal,
      },
    });
    if (!userFound) {
      req.log.warn(
        {
          user:
            userFound !== null
              ? [userFound.id, userFound.nombre]
              : "usuario no registrado",
        },
        "Intento de acceso no autorizado"
      );
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    // Comprobamos la contraseña
    // const match = password===userFound.password
    // console.log(match)
    const match = await bcrypt.compare(password, userFound.password);
    if (!match) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    // Creamos el token de acceso
    const accessToken = jwt.sign(
      {
        id: userFound.id,
        username: correo_personal,
        nombre: userFound.nombre,
        tipo: userFound.tipo,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "3d" }
    );
    // Enviamos el token de acceso al usuario
    res.json({
      username: correo_personal,
      name: userFound.nombre,
      role: userFound.tipo,
      accessToken,
    });
  } catch (error) {
    const errorLogin = new Error(
      `Ocurrio un problema al intentar iniciar sesion - ${error.message}`
    );
    errorLogin.stack = error.stack;
    next(errorLogin);
  }
};

/* --------- Register function -------------- */
export const register = async (req, res, next) => {
  try {
    // Obtener datos del cuerpo de la solicitud
    const { nombre, apellido, correo_personal, celular, password } = req.body;

    // Verificar si el usuario ya existe
    const userExists = await Usuario.findOne({ where: { correo_personal } });
    if (userExists) {
      req.log.warn(
        `El usuario con correo ${req.correo_personal} intentó registrarse de nuevo`
      );
      return res.status(409).json({ error: "El usuario ya está registrado" });
    }
    // Crear el nuevo usuario
    const newUser = await Usuario.create({
      nombre,
      apellido,
      correo_personal,
      celular,
      password,
      tipo: "Inversor",
      rol_id: 3,
    });

    // Crear el token de acceso
    const accessToken = jwt.sign(
      {
        id: newUser.id,
        username: newUser.correo_personal,
        nombre: newUser.nombre,
        tipo: newUser.tipo,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "3d" }
    );

    // Enviar el token de acceso y los detalles del usuario como respuesta
    res.status(201).json({
      username: newUser.correo_personal,
      name: newUser.nombre,
      role: newUser.tipo,
      accessToken,
    });
  } catch (error) {
    const errorRegister = new Error(
      `Error al registrar el usuario: ${error.message}`
    );
    errorRegister.stack = error.stack;
    next(errorRegister);
  }
};

/* --------- Refresh function -------------- */
export const refresh = (req, res) => {
  // Recuperamos la cookie
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    req.log.warn("No se encontro token de refresco adjunto");
    return res.status(401).json({ error: "Acceso no autorizado" });
  }
  // Obtenemos el token de refresco
  const refreshToken = cookies.jwt;
  // Verificamos el token
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, user) => {
      if (err) {
        req.log.warn("Token de refresco no proporcionado o token no valido");
        return res.status(403).json({ error: "Acceso prohibido" });
      }
      // Verificamos los datos del payload
      const foundUser = await Usuario.findByPk(user.id);
      if (!foundUser) {
        req.log.warn("Token no valido");
        return res.status(401).json({ error: "Acceso no autorizado" });
      }
      // Volvemos a crear el token de acceso
      const accessToken = jwt.sign(
        {
          id: foundUser.id,
          username: foundUser.correo_personal,
          tipo: foundUser.tipo,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "8h" }
      );
      res.status(200).json({ accessToken });
    }
  );
};

/* --------- verifyPermits function -------------- */
export const verifyPermits = async (req, res, next) => {
  try {
    // Extraer datos del cuerpo de la solicitud
    const { correo_personal, password, token } = req.body;
    // Verificar el token
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
      if (err.name === "JsonWebTokenError") {
        return res.status(401).json({ error: "Token inválido" });
      }
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Token expirado" });
      }
      return res.status(500).json({ error: "Error al verificar el token" });
    }
    // Verificar que el ID en el token corresponde con el usuario en la base de datos
    const userFound = await Usuario.findOne({ where: { correo_personal } });
    if (!userFound) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    // Validar contraseña
    const match = await bcrypt.compare(password, userFound.password);
    if (!match) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }
    // Verificar que el ID del token coincida con el usuario encontrado
    if (decodedToken.id !== userFound.id) {
      return res
        .status(403)
        .json({ error: "Token no válido para este usuario" });
    }

    // Enviar el rol del usuario
    res.json({ role: userFound.tipo });
  } catch (error) {
    const errorVerify = new Error(
      `Error al intentar verificar el acceso del usuario - ${error.message}`
    );
    errorVerify.stack = error.stack;
    next(errorVerify);
  }
};

/* --------- Logout function -------------- */
export const logout = (req, res) => {
  // Obtengo las cookies
  const cookies = req.cookies;
  // Verfico que la cookie que almacena el token de refresco existe
  if (!cookies?.jwt) {
    req.log.warn("Token de refresco no proporcionado");
    return res.status(401).json({ error: "Acceso no autorizado" });
  }
  // Elimino la cookie
  res.clearCookie("jwt", { httpOnly: true, sameSite: "Lax", secure: false });
  res.status(200).json({ message: "Sesión terminada correctamente!" });
};
