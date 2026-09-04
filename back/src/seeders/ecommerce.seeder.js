// src/seeders/ecommerce.seeder.js
import Rol from '../models/roles.model.js';
import Usuario from '../models/usuarios.model.js';
import Cliente from '../models/clientes.model.js';
import Domicilio from '../models/domicilios.model.js';
import Marca from '../models/marcas.model.js';
import Categoria from '../models/categorias.model.js';
import Producto from '../models/productos.model.js';

export const seedComputacion = async () => {
    try {
        console.log('🌱 Iniciando Seeding de Computación...');

       // 1. ROLES & USUARIOS
       const rolAdmin = await Rol.create({ nombre: 'Administrador', estado: 'activo' });
        await Usuario.create({
    nombre: 'Soporte', apellido: 'Técnico', password: 'adminpassword123',
    email: 'soporte@hardware.com', telefono: '11223344',
    direccion: 'Av. Tech 404', rolId: rolAdmin.id,
}); 

    // 2. CLIENTE & DOMICILIO
        const cliente = await Cliente.create({
    nombre: 'Lucas', apellido: 'Dev', email: 'lucas@correo.com',
    telefono: '55667788', password: 'clientepassword'
});
        await Domicilio.create({
            idCliente: cliente.id, calle: 'Calle Binaria', numero: '101',
            ciudad: 'Córdoba', codigoPostal: '5000', departamento: 'A', piso: '1'
        }); 

        // 3. MARCAS DE COMPUTACIÓN
        const marcaASUS = await Marca.create({ nombre: 'ASUS', estado: 'activo' });
        const marcaLogitech = await Marca.create({ nombre: 'Logitech', estado: 'activo' });
        const marcaCorsair = await Marca.create({ nombre: 'Corsair', estado: 'activo' });

        // 4. CATEGORÍAS
        const catLaptops = await Categoria.create({ nombre: 'Laptops', descripcion: 'Notebooks y Portátiles' });
        const catPerifericos = await Categoria.create({ nombre: 'Periféricos', descripcion: 'Teclados, ratones y audio' });
        const catHardware = await Categoria.create({ nombre: 'Hardware', descripcion: 'Componentes internos y PC' });

        // 5. PRODUCTOS ESPECÍFICOS
        // --- LAPTOP ---
        const laptop = await Producto.create({
            sku: 'ASUS-ROG-ZEPH-001',
            nombre: 'Laptop ASUS ROG Zephyrus',
            precio: 1499.99,
            descripcion: 'Notebook Gamer Ryzen 9, 32GB RAM, RTX 4070',
            imagen: JSON.stringify(['zephyrus_1.jpg', 'zephyrus_2.jpg']),
            stock: 15,
            idMarca: marcaASUS.id,
            idCategoria: catLaptops.id,
        });

        // --- PERIFÉRICO ---
        const mouse = await Producto.create({
            sku: 'LOGI-GPROX-001',
            nombre: 'Mouse Logitech G Pro X Superlight',
            precio: 129.50,
            descripcion: 'Mouse inalámbrico ultra liviano para Esports',
            imagen: JSON.stringify(['gpro_white.jpg']),
            stock: 40,
            idMarca: marcaLogitech.id,
            idCategoria: catPerifericos.id,
        });

        // --- HARDWARE / COMPONENTE ---
        const ram = await Producto.create({
            sku: 'CORSAIR-DDR5-32-001',
            nombre: 'Memoria RAM Corsair Vengeance DDR5 32GB',
            precio: 115.00,
            descripcion: 'Kit de 2x16GB 6000MHz CL36 optimizado para AMD/Intel',
            imagen: JSON.stringify(['corsair_ddr5.jpg']),
            stock: 25,
            idMarca: marcaCorsair.id,
            idCategoria: catHardware.id,
        });

        console.log('✅ Base de datos de Computación poblada con éxito.');
    } catch (error) {
        console.error('❌ Error en el seeder de computación:', error);
    }
};