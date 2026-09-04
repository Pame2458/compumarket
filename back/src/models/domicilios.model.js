// src/models/Domicilio.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import Usuario from "./clientes.model.js";

const Domicilio = sequelize.define("Domicilio", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  calle: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  numero: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ciudad: {
    type: DataTypes.STRING,
    allowNull: false,
  },
   departamento: {
    type: DataTypes.STRING,
    allowNull: false,
  },
   piso: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  codigoPostal: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  idCliente: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  timestamps: true // createdAt y updatedAt
});



export default Domicilio;
