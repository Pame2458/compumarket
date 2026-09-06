
import express from "express";
import cors from "cors";
// Importamos el enrutador central de la API como 'default' (sin llaves)
import router from './routes/index.js'; 
import sequelize from './config/database.js';

// Importamos el índice de modelos para que Sequelize registre las asociaciones del DER.
import './models/index.js';
// 🌟 IMPORTACIÓN DEL SEEDER DE COMPUTACIÓN
import { seedComputacion } from './seeders/ecommerce.seeder.js';
//import { seedAdminInicial } from './seeders/admin.seeder.js';
// ...
// Descomentar UNA SOLA VEZ, correr, y volver a comentar:

// Creamos la aplicación Express.
const app = express();

// Configuración de orígenes permitidos para CORS
const allowedOrigins = [
    'https://miszapatos.com',
    'http://localhost:5173',
    'http://localhost:5174',
];

const corsOptions = {
    origin: (origin, callback) => {
        // Las peticiones sin origin (como Postman o curl) se permiten.
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        console.warn(`Origen no permitido por CORS: ${origin}`);
        return callback(new Error('No permitido por CORS'));
    },
    credentials: true,
};

app.use(cors(corsOptions));

// express.json() permite leer el cuerpo de las peticiones en formato JSON.
app.use(express.json());

// Asociamos el enrutador central de la API bajo el prefijo ordenado '/api'
app.use('/api', router);

// El puerto se lee de una variable de entorno o, si no existe, usamos 3000.
const PUERTO = process.env.PORT || 3000;

// Función que inicia el servidor una vez verificada la conexión con la base de datos.
const iniciarServidor = async () => {
    try {
        // Sincronización segura de la estructura de tablas en desarrollo diario
        //await sequelize.sync({ force: true });

        await sequelize.sync({ alter: true });
        console.log('Conexión a la base de datos establecida y tablas sincronizadas correctamente.');
               // 🌟 EJECUCIÓN DEL SEEDER 
           // await seedAdminInicial();
            await seedComputacion();

        // app.listen() pone al servidor a escuchar peticiones en el puerto indicado.
        app.listen(PUERTO, () => {
            console.log('Servidor iniciado correctamente en el puerto:', PUERTO);
            console.log(`API disponible en: http://localhost:${PUERTO}/api`);
        });
    } catch (error) {
        console.error('No se pudo conectar a la base de datos:', error);
    }
};

iniciarServidor();
