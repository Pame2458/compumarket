import Rol from '../models/roles.model.js';
import Usuario from '../models/usuarios.model.js';

export const seedAdminInicial = async () => {
    try {
        console.log('🌱 Creando administrador inicial...');

        const [rolAdmin] = await Rol.findOrCreate({
            where: { nombre: 'Administrador' },
            defaults: { estado: 'activo' },
        });

        const existe = await Usuario.findOne({ where: { email: 'admin@test' } });
        if (existe) {
            console.log('ℹ️ El administrador ya existe.');
            return;
        }

        await Usuario.create({
            nombre: 'Admin',
            apellido: 'Principal',
            email: 'admin@test',
            telefono: '000000000',
            direccion: 'Panel Admin',
            rolId: rolAdmin.id,
            password: 'admin123456', // se hashea solo, gracias al hook ya corregido
        });

        console.log('✅ Admin creado: admin@test / admin123456');
    } catch (error) {
        console.error('❌ Error creando admin:', error);
    }
};