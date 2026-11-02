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

// Envía un mail usando el emisorDeCorreo de arriba.
// Devuelve true si se envió y false si falló, así un error de mail
// nunca rompe la confirmación del pedido.
export const enviarCorreo = async (destinatario, asunto, cuerpoHtml) => {
    try {
        const info = await emisorDeCorreo.sendMail({
            from: `"compuMarket" <${process.env.CORREO_EMISOR}>`,
            to: destinatario,
            subject: asunto,
            html: cuerpoHtml,
        });
        console.log('📧 Correo enviado a ' + destinatario + ', id: ' + info.messageId);
        return true;
    } catch (error) {
        console.error('⚠️ Error al enviar correo a ' + destinatario + ':', error.message);
        return false;
    }
};