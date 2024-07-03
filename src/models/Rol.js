import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

const Rol = sequelize.define('Roles', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
}, {
        timestamps: false,
        freezeTableName: true
    });

export default Rol;
