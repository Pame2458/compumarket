/*import { Sequelize } from 'sequelize';

// Creamos la instancia de conexión utilizando tus variables de entorno (.env)
const sequelize = new Sequelize(
  process.env.DB_NAME || 'ecommerce1', // Nombre de la BD
  process.env.DB_USER || 'root',             // Usuario
  process.env.DB_PASSWORD || '',             // Contraseña
  {
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'mysql', // Cambia a 'postgres', 'mariadb' o 'sqlite' según tu motor de BD
    logging: false,   // Evita que llene la consola con logs de SQL (puedes cambiarlo a true en desarrollo)
    define: {
      timestamps: true // Asegura que todos los modelos tengan createdAt y updatedAt por defecto
    }
  }
);

// Exportación nombrada y por defecto para evitar cualquier conflicto en tus modelos
export { sequelize };
export default sequelize;*/
import { Sequelize } from 'sequelize';

// Creamos la instancia de conexión utilizando tus variables de entorno (.env)
const sequelize = new Sequelize(
  process.env.DB_NAME || 'ecommerce1',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
    // SSL solo si DB_SSL=true (lo vamos a usar con la base de Aiven)
    dialectOptions: process.env.DB_SSL === 'true'
      ? { ssl: { rejectUnauthorized: false } }
      : {},
    define: {
      timestamps: true
    }
  }
);

export { sequelize };
export default sequelize;