import Rol from "../models/Rol.js";
import Usuario from "../models/Usuario.js";

/* --------- getProfile function -------------- */
const getProfile = async (req, res, next) => {
  // Obtenemos el identificador del usuario
  const { id } = req.user;

  try {
    let excluded_attributes = ["password", "rol_id"];

    // Buscamos el usuario
    const existUser = await Usuario.findByPk(id, {
      attributes: { exclude: excluded_attributes },
    });
    return res.status(200).json(existUser);
  } catch (error) {
    const errorGetPerfil = new Error(
      `Ocurrio un problema al obtener el perfil del usuario - ${error.message}`
    );
    errorGetPerfil.stack = error.stack;
    next(errorGetPerfil);
  }
};

/* --------- getUsuarios function -------------- */
const getUsuarios = async (req, res, next) => {
  try {
    // Consultamos a los usuarios
    const usuarios = await Usuario.findAll({
      attributes: [
        "id",
        "nombre",
        "apellido",
        "correo_personal",
        "celular",
        "tipo",
      ],
    });

    // Respondemos al usuario
    res.status(200).json(usuarios);
  } catch (error) {
    const errorGetTea = new Error(
      `Ocurrio un problema al intentar obtener los usuarios - ${error.message}`
    );
    errorGetTea.stack = error.stack;
    next(errorGetTea);
  }
};

/* --------- getUsuarioById function -------------- */
const getUsuarioById = async (req, res, next) => {
  // Obtenemos el id del usuario
  const { id } = req.params;
  try {
    // Obtenemos el docente
    const usuario = await Usuario.findOne({
      where: {
        id,
      },
      attributes: ["nombre", "apellido", "correo_personal", "celular", "tipo"],
    });
    if (!usuario) {
      req.log.warn("Intento de acceso a usuario inexistente");
      return res
        .status(400)
        .json({ error: "No es posible identificar al usuario especificado" });
    }
    // Respondemos al usuario
    res.status(200).json(usuario);
  } catch (error) {
    const errorGetTeatId = new Error(
      `Ocurrio un problema al intentar obtener la información del usuario especificado - ${error.message}`
    );
    errorGetTeatId.stack = error.stack;
    next(errorGetTeatId);
  }
};

/* --------- updateRolUser function -------------- */
const updateRolUser = async (req, res, next) => {
  //Obtenemos el id del usuario a actualizar
  const { id } = req.params;
  // Obtenemos los datos a actualizar
  const { tipo } = req.body;
  try {
    // Obtenemos el usuario y verificamos su existencia
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      req.log.warn("Intento de acceso a usuario inexistente");
      return res.status(400).json({
        error: "No se encuentra ningun usuario asociado con el id especificado",
      });
    }
    const rol = await Rol.findOne({
      where: {
        nombre: tipo,
      },
    });
    // if (!rol) {
    //   req.log.warn("Asignación de rol inexistente");
    //   return res.status(400).json({ error: "No existe ese rol en el sistema" });
    // }
    // Actualizamos el rol
    await usuario.update({
      tipo,
      rol_id: rol.id,
    });
    // Respondemos a la petición
    return res
      .status(200)
      .json({ message: "Rol del usuario actualizado correctamente" });
  } catch (error) {
    const errorUpdtTeaDir = new Error(
      `Ocurrio un problema al intentar actualizar el rol del usuario - ${error.message}`
    );
    errorUpdtTeaDir.stack = error.stack;
    next(errorUpdtTeaDir);
  }
};

const userController = {
  getProfile,
  getUsuarios,
  getUsuarioById,
  updateRolUser,
};

export default userController;
