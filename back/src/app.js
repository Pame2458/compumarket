/* 'dotenv/config';

import express from "express";
import cors from "cors";
// Importamos el enrutador central de la API como 'default' (sin llaves)
import router from './routes/index.js'; 
import sequelize from './config/database.js';
import {emisorDeCorreo} from './config/configuracionCorreo.js'; // Importación del archivo de configuración de correo   

// Importamos el índice de modelos para que Sequelize registre las asociaciones del DER.
import './models/index.js';
// 🌟 IMPORTACIÓN DEL SEEDER DE COMPUTACIÓN
import { seedComputacion } from './seeders/ecommerce.seeder.js';
import path from 'path';

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
app.use('/uploads', express.static(path.resolve('uploads')));
// express.json() permite leer el cuerpo de las peticiones en formato JSON.
app.use(express.json());

// Asociamos el enrutador central de la API bajo el prefijo ordenado '/api'
app.use('/api', router);

// El puerto se lee de una variable de entorno o, si no existe, usamos 3000.
const PUERTO = process.env.PORT || 3000;

// Función que inicia el servidor una vez verificada la conexión con la base de datos.
const iniciarServidor = async () => {
    try {
        // Sincronización segura para el día a día: solo crea tablas que
        // no existen, nunca borra ni altera las que ya están.
        // (Si en algún momento necesitás reflejar un cambio de modelo en
        // la DB, corré una vez sequelize.sync({ alter: true }) a mano y
        // después volvé a dejar esta línea así.)
        await sequelize.sync();

        console.log('Conexión a la base de datos establecida y tablas sincronizadas correctamente.');

        // 🌟 EJECUCIÓN DEL SEEDER
        /* try{
            //   await seedComputacion();
        }catch(error){
            console.error('Error al ejecutar el seeder:', error);
        }*/

        // app.listen() pone al servidor a escuchar peticiones en el puerto indicado.
   /*     emisorDeCorreo.verify()
            .then(() => {
                console.log('✅ El servidor de correos (Nodemailer) está conectado y listo.');
            })
            .catch((errorDeConexion) => {
                console.error('❌ Error: El servidor no se pudo conectar a Gmail:', errorDeConexion.message);
            });
        app.listen(PUERTO, () => {
            console.log('Servidor iniciado correctamente en el puerto:', PUERTO);
            console.log(`API disponible en: http://localhost:${PUERTO}/api`);
        });
    } catch (error) {
        console.error('No se pudo conectar a la base de datos:', error);
    }
};

iniciarServidor();*/
import 'dotenv/config';

import express from "express";
import cors from "cors";
import router from './routes/index.js';
import sequelize from './config/database.js';
import { emisorDeCorreo } from './config/configuracionCorreo.js';

// Importamos el índice de modelos para que Sequelize registre las asociaciones del DER.
import './models/index.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Creamos la aplicación Express.
const app = express();

// Orígenes permitidos para CORS (desarrollo local)
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
];

// También se permite el propio dominio del servidor (cuando el front y el back
// están juntos en el mismo lugar, como en Render).
const corsOptionsDelegate = (req, callback) => {
    const origin = req.header('Origin');
    let permitido = false;

    if (!origin) {
        permitido = true; // Postman, curl, etc.
    } else if (allowedOrigins.includes(origin)) {
        permitido = true;
    } else {
        try {
            permitido = new URL(origin).host === req.headers.host;
        } catch {
            permitido = false;
        }
    }

    if (!permitido) console.warn(`Origen no permitido por CORS: ${origin}`);
    callback(null, { origin: permitido, credentials: true });
};

app.use(cors(corsOptionsDelegate));
app.use('/uploads', express.static(path.resolve('uploads')));
// express.json() permite leer el cuerpo de las peticiones en formato JSON.
app.use(express.json());

// Enrutador central de la API bajo el prefijo '/api'
app.use('/api', router);

// ---- Servir el front ya armado (front/dist) ----
const rutaFront = path.resolve(__dirname, '../../front/dist');
if (fs.existsSync(rutaFront)) {
    app.use(express.static(rutaFront));
    // Cualquier otra ruta GET devuelve el front (para que funcione React Router)
    app.use((req, res, next) => {
        if (req.method !== 'GET' || req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
            return next();
        }
        res.sendFile(path.join(rutaFront, 'index.html'));
    });
}

// El puerto se lee de una variable de entorno o, si no existe, usamos 3000.
const PUERTO = process.env.PORT || 3000;

// Función que inicia el servidor una vez verificada la conexión con la base de datos.
const iniciarServidor = async () => {
    try {
        // Sincronización segura: solo crea tablas que no existen.
        await sequelize.sync();

        console.log('Conexión a la base de datos establecida y tablas sincronizadas correctamente.');

        emisorDeCorreo.verify()
            .then(() => {
                console.log('✅ El servidor de correos (Nodemailer) está conectado y listo.');
            })
            .catch((errorDeConexion) => {
                console.error('❌ Error: El servidor no se pudo conectar a Gmail:', errorDeConexion.message);
            });

        app.listen(PUERTO, () => {
            console.log('Servidor iniciado correctamente en el puerto:', PUERTO);
            console.log(`API disponible en: http://localhost:${PUERTO}/api`);
        });
    } catch (error) {
        console.error('No se pudo conectar a la base de datos:', error);
    }
};

iniciarServidor();