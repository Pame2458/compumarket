import { sequelize } from './database.js';
import { Rol, Marca, Categoria, Producto, ProductoCategoria } from '../models/index.js';

const ejecutarSeed = async () => {
    try {
        console.log('⏳ Conectando a MySQL para inyectar datos de prueba...');
        
        // Sincroniza y limpia las tablas para evitar duplicados en cada ejecución
        await sequelize.sync({ force: true });
        console.log('🗑️ Base de datos limpiada y reestructurada correctamente.');

        // 1. INYECTAR ROLES DEL STAFF
        console.log('🌱 Inyectando Roles...');
        const roles = await Rol.bulkCreate([
            { nombre: 'Administrador', descripcion: 'Acceso total al panel de control de compuMarket' },
            { nombre: 'Logistica', descripcion: 'Gestión de embalado, etiquetado y despachos de envíos' },
            { nombre: 'Soporte', descripcion: 'Gestión de clientes y moderación de calificaciones' }
        ]);

        // 2. INYECTAR MARCAS DE HARDWARE
        console.log('🌱 Inyectando Marcas...');
        const marcas = await Marca.bulkCreate([
            { nombre: 'ASUS', estado: 'activo' },
            { nombre: 'Intel', estado: 'activo' },
            { nombre: 'Corsair', estado: 'activo' },
            { nombre: 'AMD', estado: 'activo' },
            { nombre: 'NVIDIA', estado: 'activo' }
        ]);

        // 3. INYECTAR CATEGORÍAS
        console.log('🌱 Inyectando Categorías...');
        const categorias = await Categoria.bulkCreate([
            { nombre: 'Procesadores', descripcion: 'CPUs de última generación para gaming y servidores' },
            { nombre: 'Placas de Video', descripcion: 'GPUs de alto rendimiento y trazado de rayos' },
            { nombre: 'Memorias RAM', descripcion: 'Módulos DDR4 y DDR5 de alta velocidad' },
            { nombre: 'Componentes de PC', descripcion: 'Categoría global para hardware interno' }
        ]);

        // Mapeo de IDs generados para las relaciones foráneas
        const idASUS = marcas[0].id;
        const idIntel = marcas[1].id;
        const idCorsair = marcas[2].id;
        const idAMD = marcas[3].id;
        const idNVIDIA = marcas[4].id;

        const catProcesadores = categorias[0].id;
        const catGPUs = categorias[1].id;
        const catRAM = categorias[2].id;
        const catComponentes = categorias[3].id;

        // 4. INYECTAR PRODUCTOS TECNOLÓGICOS (Con SKU único y validación de stock)
        console.log('🌱 Inyectando Productos...');
        const productos = await Producto.bulkCreate([
            {
                idMarca: idIntel,
                sku: 'INT-I9-14900K',
                nombre: 'Procesador Intel Core i9-14900K',
                precio: 589.99,
                stock: 25,
                peso: 150,
                descripcion: 'Procesador con 24 núcleos y hasta 6.0 GHz de frecuencia térmica.',
                estado: 'activo'
            },
            {
                idMarca: idAMD,
                sku: 'AMD-R7-7800X3D',
                nombre: 'Procesador AMD Ryzen 7 7800X3D',
                precio: 399.00,
                stock: 40,
                peso: 140,
                descripcion: 'El mejor procesador para gaming con tecnología 3D V-Cache.',
                estado: 'activo'
            },
            {
                idMarca: idASUS,
                sku: 'ASU-RTX4090-ROG',
                nombre: 'Placa de Video ASUS ROG Strix RTX 4090 24GB',
                precio: 1999.99,
                stock: 8,
                peso: 2500,
                descripcion: 'Rendimiento bestial con arquitectura Ada Lovelace y DLSS 3.',
                estado: 'activo'
            },
            {
                idMarca: idCorsair,
                sku: 'COR-VEN-32GB-D5',
                nombre: 'Memoria RAM Corsair Vengeance DDR5 32GB (2x16GB) 6000MHz',
                precio: 125.50,
                stock: 100,
                peso: 90,
                descripcion: 'Módulos optimizados para placas base Intel y AMD con perfiles XMP 3.0.',
                estado: 'activo'
            }
        ]);

        // 5. RELACIONAR PRODUCTOS CON CATEGORÍAS (Muchos a Muchos)
        console.log('🌱 Vinculando Productos con Múltiples Categorías...');
        await ProductoCategoria.bulkCreate([
            // Intel i9 pertenece a "Procesadores" y a "Componentes de PC"
            { idProducto: productos[0].id, idCategoria: catProcesadores },
            { idProducto: productos[0].id, idCategoria: catComponentes },

            // AMD Ryzen 7 pertenece a "Procesadores" y a "Componentes de PC"
            { idProducto: productos[1].id, idCategoria: catProcesadores },
            { idProducto: productos[1].id, idCategoria: catComponentes },

            // RTX 4090 pertenece a "Placas de Video" y a "Componentes de PC"
            { idProducto: productos[2].id, idCategoria: catGPUs },
            { idProducto: productos[2].id, idCategoria: catComponentes },

            // RAM Corsair pertenece a "Memorias RAM" y a "Componentes de PC"
            { idProducto: productos[3].id, idCategoria: catRAM },
            { idProducto: productos[3].id, idCategoria: catComponentes }
        ]);

        console.log('🚀 ¡Seeder ejecutado con éxito! Tu base de datos tiene datos tecnológicos listos.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error crítico al ejecutar el Seeder:', error.message);
        process.exit(1);
    }
};

ejecutarSeed();
