// archivo: backend/configuracionCorreo.js
import nodemailer from 'nodemailer';

export const emisorDeCorreo = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, 
    auth: {
        // Node.js leerá en secreto lo que esté escrito en el archivo .env
        user: process.env.CORREO_EMISOR, 
        pass: process.env.CLAVE_APLICACION 
    }
});

emisorDeCorreo.verify().then(() => {
    console.log('✅ El servidor de correos está listo de forma segura.');
}).catch((errorDeConexion) => {
    console.error('❌ Hubo un error de conexión segura:', errorDeConexion);
});