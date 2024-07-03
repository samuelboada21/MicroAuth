import { DataTypes } from "sequelize";
import encrypt from "../util/encryptPassword.js";
import sequelize from "../database/db.js";

const Usuario = sequelize.define(
  "Usuarios",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    apellido: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    correo_personal: {
      type: DataTypes.STRING,
      unique: true,
    },
    celular: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tipo: {
      type: DataTypes.ENUM("Administrador", "Asegurador", "Inversor"),
      allowNull: false,
    },
    rol_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "Roles",
        key: "id",
      },
    },
  },
  {
    hooks: {
      beforeCreate: async (user, options) => {
        try {
          const hashedPassword = await encrypt(user.password);
          user.password = hashedPassword;
        } catch (err) {
          const errorPassword = new Error(
            `Error al intentar encriptar la contraseña del usuario con ID ${user.id}`
          );
          errorPassword.stack = err.stack;
          throw errorPassword;
        }
      },
    },
    paranoid: false,
    timestamps: false,
    freezeTableName: true,
  }
);

export default Usuario;
