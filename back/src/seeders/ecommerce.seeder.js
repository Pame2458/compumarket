// src/seeders/ecommerce.seeder.js
import Rol from '../models/roles.model.js';
import Usuario from '../models/usuarios.model.js';
import Cliente from '../models/clientes.model.js';
import Domicilio from '../models/domicilios.model.js';
import Marca from '../models/marcas.model.js';
import Categoria from '../models/categorias.model.js';
import Producto from '../models/productos.model.js';

export const seedComputacion = async () => {
    console.log('🌱 Iniciando Seeding de Computación...');

    // Variables de referencia para almacenar los IDs necesarios en módulos posteriores
    let idRolAdmin = null;
    let idCliente = null;
    let idMarcaASUS = null, idMarcaLogitech = null, idMarcaCorsair = null;
    let idCatLaptops = null, idCatPerifericos = null, idCatHardware = null;

    // 1. ROLES & USUARIOS
    try {
        console.log('🔄 Cargando Roles y Usuarios...');
        const rolAdmin = await Rol.create({ nombre: 'Administrador', estado: 'activo' });
        idRolAdmin = rolAdmin.id;


        await Usuario.create({
            nombre: 'Administrador',             
            apellido: 'Técnico', 
            password: 'adminpassword123',  
            email: 'soporte@hardware.com', 
            telefono: '11223344',
            direccion: 'Av. Tech 404', 
            rolId: idRolAdmin,
        });
        console.log('🔹 Módulo 1 completado: Roles y Usuarios creados de forma segura.');
    } catch (error) {
        console.error('⚠️ Error en Módulo 1 (Roles/Usuarios):', error.message || error);
        // Intentamos recuperar el ID si ya existía para no romper la vinculación posterior
        try {
            const adminExistente = await Rol.findOne({ where: { nombre: 'Administrador' } });
            if (adminExistente) idRolAdmin = adminExistente.id;
        } catch (findError) { console.error('No se pudo recuperar el ID de Rol existente'); }
    }

    // 2. CLIENTE & DOMICILIO
    try {
        console.log('🔄 Cargando Clientes y Domicilios...');


        const cliente = await Cliente.create({
            nombre: 'Lucas', 
            apellido: 'Dev', 
            email: 'lucas@correo.com',
            telefono: '55667788', 
            password: 'clientepassword'      
        });
        idCliente = cliente.id;

        await Domicilio.create({
            idCliente: idCliente, calle: 'Calle Binaria', numero: '101',
            ciudad: 'Córdoba', codigoPostal: '5000', departamento: 'A', piso: '1'
        });
        console.log('🔹 Módulo 2 completado: Cliente y Domicilio creados de forma segura.');
    } catch (error) {
        console.error('⚠️ Error en Módulo 2 (Cliente/Domicilio):', error.message || error);
        try {
            const clienteExistente = await Cliente.findOne({ where: { email: 'lucas@correo.com' } });
            if (clienteExistente) idCliente = clienteExistente.id;
        } catch (findError) { console.error('No se pudo recuperar el ID del Cliente existente'); }
    }

    // 3. MARCAS DE COMPUTACIÓN
    try {
        console.log('🔄 Cargando Marcas...');
        const marcaASUS = await Marca.create({ nombre: 'ASUS', estado: 'activo' });
        idMarcaASUS = marcaASUS.id;
    } catch (error) { console.error('⚠️ Error al crear marca ASUS:', error.message); }

    try {
        const marcaLogitech = await Marca.create({ nombre: 'Logitech', estado: 'activo' });
        idMarcaLogitech = marcaLogitech.id;
    } catch (error) { console.error('⚠️ Error al crear marca Logitech:', error.message); }

    try {
        const marcaCorsair = await Marca.create({ nombre: 'Corsair', estado: 'activo' });
        idMarcaCorsair = marcaCorsair.id;
        console.log('🔹 Módulo 3 completado: Procesamiento de Marcas finalizado.');
    } catch (error) { console.error('⚠️ Error al crear marca Corsair:', error.message); }

    // Auxiliar para recuperar IDs de marcas si falló el create por duplicado
    try {
        if (!idMarcaASUS) idMarcaASUS = (await Marca.findOne({ where: { nombre: 'ASUS' } }))?.id;
        if (!idMarcaLogitech) idMarcaLogitech = (await Marca.findOne({ where: { nombre: 'Logitech' } }))?.id;
        if (!idMarcaCorsair) idMarcaCorsair = (await Marca.findOne({ where: { nombre: 'Corsair' } }))?.id;
    } catch (err) { console.error('Error al recuperar IDs de Marcas existentes'); }


    // 4. CATEGORÍAS
    try {
        console.log('🔄 Cargando Categorías...');
        const catLaptops = await Categoria.create({ nombre: 'Laptops', descripcion: 'Notebooks y Portátiles' });
        idCatLaptops = catLaptops.id;
    } catch (error) { console.error('⚠️ Error al crear categoría Laptops:', error.message); }

    try {
        const catPerifericos = await Categoria.create({ nombre: 'Periféricos', descripcion: 'Teclados, ratones y audio' });
        idCatPerifericos = catPerifericos.id;
    } catch (error) { console.error('⚠️ Error al crear categoría Periféricos:', error.message); }

    try {
        const catHardware = await Categoria.create({ nombre: 'Hardware', descripcion: 'Componentes internos y PC' });
        idCatHardware = catHardware.id;
        console.log('🔹 Módulo 4 completado: Procesamiento de Categorías finalizado.');
    } catch (error) { console.error('⚠️ Error al crear categoría Hardware:', error.message); }

    // Auxiliar para recuperar IDs de categorías si falló el create por duplicado
    try {
        if (!idCatLaptops) idCatLaptops = (await Categoria.findOne({ where: { nombre: 'Laptops' } }))?.id;
        if (!idCatPerifericos) idCatPerifericos = (await Categoria.findOne({ where: { nombre: 'Periféricos' } }))?.id;
        if (!idCatHardware) idCatHardware = (await Categoria.findOne({ where: { nombre: 'Hardware' } }))?.id;
    } catch (err) { console.error('Error al recuperar IDs de Categorías existentes'); }


    // 5. PRODUCTOS ESPECÍFICOS
    console.log('🔄 Cargando Productos Específicos...');
    
    // --- LAPTOP ---
    try {
        await Producto.create({
            sku: 'ASUS-ROG-ZEPH-001',
            nombre: 'Laptop ASUS ROG Zephyrus',
            precio: 1499.99,
            descripcion: 'Notebook Gamer Ryzen 9, 32GB RAM, RTX 4070',
            imagen: JSON.stringify(['zephyrus_1.jpg', 'zephyrus_2.jpg']),
            stock: 15,
            idMarca: idMarcaASUS,
            idCategoria: idCatLaptops,
        });
        console.log('📦 Producto cargado: Laptop ASUS ROG Zephyrus');
    } catch (error) { console.error('⚠️ Error al crear producto Laptop:', error.message); }

    // --- PERIFÉRICO ---
    try {
        await Producto.create({
            sku: 'LOGI-GPROX-001',
            nombre: 'Mouse Logitech G Pro X Superlight',
            precio: 129.50,
            descripcion: 'Mouse inalámbrico ultra liviano para Esports',
            imagen: JSON.stringify(['gpro_white.jpg']),
            stock: 40,
            idMarca: idMarcaLogitech,
            idCategoria: idCatPerifericos,
        });
        console.log('📦 Producto cargado: Mouse Logitech G Pro X');
    } catch (error) { console.error('⚠️ Error al crear producto Mouse:', error.message); }

    // --- HARDWARE / COMPONENTE ---
    try {
        await Producto.create({
            sku: 'CORSAIR-DDR5-32-001',
            nombre: 'Memoria RAM Corsair Vengeance DDR5 32GB',
            precio: 115.00,
            descripcion: 'Kit de 2x16GB 6000MHz CL36 optimizado para AMD/Intel',
            imagen: JSON.stringify(['corsair_ddr5.jpg']),
            stock: 25,
            idMarca: idMarcaCorsair,
            idCategoria: idCatHardware,
        });
        console.log('📦 Producto cargado: Memoria RAM Corsair DDR5');
    } catch (error) { console.error('⚠️ Error al crear producto RAM:', error.message); }

    console.log('🏁 Proceso de Seeding finalizado con contraseñas encriptadas y capturas individuales.');
};