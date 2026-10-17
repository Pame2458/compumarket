import { sequelize } from './database.js';
import { Rol, Marca, Categoria, Producto, ProductoCategoria } from '../models/index.js';
import Usuario from '../models/usuarios.model.js';

const ejecutarSeedNube = async () => {
    try {
        console.log('⏳ Cargando datos para la demo...');
        await sequelize.sync({ force: true });

        // ROLES
        const roles = await Rol.bulkCreate([
            { nombre: 'Administrador', descripcion: 'Acceso total al panel de control de compuMarket' },
            { nombre: 'Logistica', descripcion: 'Gestión de embalado, etiquetado y despachos de envíos' },
            { nombre: 'Soporte', descripcion: 'Gestión de clientes y moderación de calificaciones' }
        ]);

        // USUARIO ADMIN (create, no bulkCreate, para que se encripte la contraseña)
        await Usuario.create({
            nombre: 'Soporte',
            apellido: 'Técnico',
            email: 'soporte@hardware.com',
            password: 'adminpassword123',
            telefono: '11223344',
            direccion: 'Av. Tech 404',
            rolId: roles[0].id
        });

        // MARCAS
        const nombresMarcas = [
            'ASUS', 'Logitech', 'Corsair', 'HP', 'Razer', 'Kingston', 'Dell', 'Lenovo',
            'Acer', 'MSI', 'Samsung', 'SteelSeries', 'HyperX', 'Cooler Master', 'Seagate',
            'Western Digital', 'EVGA', 'Gigabyte', 'NZXT', 'JBL'
        ];
        const marcasCreadas = await Marca.bulkCreate(
            nombresMarcas.map(nombre => ({ nombre, estado: 'activo' }))
        );
        const marca = {};
        marcasCreadas.forEach(m => { marca[m.nombre] = m.id; });

        // CATEGORÍAS
        const categoriasCreadas = await Categoria.bulkCreate([
            { nombre: 'Laptops', descripcion: 'Notebooks y Portátiles' },
            { nombre: 'Periféricos', descripcion: 'Teclados, ratones y audio' },
            { nombre: 'Hardware', descripcion: 'Componentes internos y PC' }
        ]);
        const [L, P, H] = categoriasCreadas.map(c => c.id);

        const ruta = (archivo) => `/uploads/productos/${archivo}`;

        // [sku, nombre, precio, descripcion, stock, marca, idCategoria, imagenes]
        const datos = [
            // --- Con fotos ---
            ['AUR-MOR-001', 'Auriculares Gamer Morados', 49.99, 'Auriculares gamer con diadema acolchada y sonido envolvente.', 30, 'JBL', P, [ruta('auricularmorado.png'), ruta('auricularmorado1.png')]],
            ['AUR-GAM-001', 'Auriculares Gamer', 59.99, 'Auriculares con micrófono, cómodos para largas sesiones.', 25, 'HyperX', P, [ruta('auricular.png')]],
            ['SAM-GALBOOK-001', 'Laptop Samsung Galaxy Book', 899.00, 'Notebook liviana y potente para estudiar y trabajar.', 15, 'Samsung', L, [ruta('galaxybook.png'), ruta('galaxybook1.png')]],
            ['MOT-ASUS-001', 'Motherboard ASUS', 139.99, 'Placa madre con soporte para procesadores de última generación.', 12, 'ASUS', H, [ruta('mother.png'), ruta('mother1.png')]],

            // --- Laptops ---
            ['HP-PAV-15-002', 'Laptop HP Pavilion 15', 799.99, 'Intel Core i5, 16GB RAM, SSD 512GB', 20, 'HP', L, []],
            ['DELL-INSP-14-001', 'Laptop Dell Inspiron 14', 649.99, 'Intel Core i3, 8GB RAM, SSD 256GB', 22, 'Dell', L, []],
            ['LENOVO-IP5-001', 'Laptop Lenovo IdeaPad 5', 729.00, 'AMD Ryzen 7, 16GB RAM, SSD 512GB', 18, 'Lenovo', L, []],
            ['ACER-ASPIRE5-001', 'Laptop Acer Aspire 5', 599.99, 'Intel Core i5, 8GB RAM, SSD 512GB', 25, 'Acer', L, []],
            ['MSI-KATANA15-001', 'Laptop MSI Katana 15', 1199.00, 'Intel i7, 16GB RAM, RTX 4060', 12, 'MSI', L, []],
            ['ASUS-VIVOBOOK-001', 'Laptop ASUS Vivobook 15', 549.99, 'Intel Core i3, 8GB RAM, SSD 256GB', 30, 'ASUS', L, []],
            ['SAMSUNG-GALBOOK3-001', 'Laptop Samsung Galaxy Book3', 899.00, 'Intel Core i5, 16GB RAM, SSD 512GB', 15, 'Samsung', L, []],
            ['LENOVO-LEGION5-001', 'Laptop Lenovo Legion 5', 1299.99, 'Ryzen 7, 32GB RAM, RTX 4070', 10, 'Lenovo', L, []],
            ['ACER-SWIFT3-001', 'Laptop Acer Swift 3', 679.99, 'Intel Core i5, 8GB RAM, SSD 512GB, ultraliviana', 20, 'Acer', L, []],
            ['HP-OMEN16-001', 'Laptop HP Omen 16', 1349.00, 'Intel i7, 16GB RAM, RTX 4060', 9, 'HP', L, []],

            // --- Periféricos ---
            ['RAZER-VIPMINI-001', 'Mouse Razer Viper Mini', 39.99, 'Mouse gamer liviano, sensor óptico de alta precisión', 35, 'Razer', P, []],
            ['LOGI-K380-001', 'Teclado Logitech K380', 34.99, 'Teclado inalámbrico multidispositivo Bluetooth', 30, 'Logitech', P, []],
            ['HYPERX-CLOUD2-001', 'Auriculares HyperX Cloud II', 89.99, 'Headset gamer con sonido envolvente 7.1', 25, 'HyperX', P, []],
            ['STEEL-APEX3-001', 'Teclado SteelSeries Apex 3', 59.99, 'Teclado mecánico con retroiluminación RGB', 28, 'SteelSeries', P, []],
            ['CORSAIR-K55-001', 'Teclado Corsair K55 RGB', 49.99, 'Teclado gamer con teclas de acceso rápido programables', 20, 'Corsair', P, []],
            ['LOGI-C920-001', 'Webcam Logitech C920', 69.99, 'Webcam Full HD 1080p con micrófono estéreo', 32, 'Logitech', P, []],
            ['RAZER-KRAKENX-001', 'Auriculares Razer Kraken X', 49.99, 'Headset liviano con sonido envolvente 7.1', 27, 'Razer', P, []],
            ['JBL-QUANTUM100-001', 'Auriculares JBL Quantum 100', 29.99, 'Headset gamer con sonido JBL QuantumSOUND', 40, 'JBL', P, []],
            ['STEEL-RIVAL3-001', 'Mouse SteelSeries Rival 3', 29.99, 'Mouse gamer con iluminación RGB Prism', 33, 'SteelSeries', P, []],
            ['CORSAIR-M65-001', 'Mouse Corsair M65 RGB Elite', 59.99, 'Mouse gamer con peso ajustable y sensor de 18000 DPI', 22, 'Corsair', P, []],

            // --- Hardware ---
            ['KING-SSD-1TB-001', 'SSD Kingston NV2 1TB NVMe', 65.00, 'Unidad de estado sólido NVMe PCIe 4.0', 50, 'Kingston', H, []],
            ['CORSAIR-PSU-750-001', 'Fuente Corsair RM750x 750W 80+ Gold', 110.00, 'Fuente modular certificada 80+ Gold', 18, 'Corsair', H, []],
            ['CORSAIR-VENG16-001', 'Memoria RAM Corsair Vengeance 16GB DDR4', 45.00, 'Kit de 2x8GB 3200MHz CL16', 40, 'Corsair', H, []],
            ['SEAGATE-BARRACUDA-2TB-001', 'Disco Rígido Seagate Barracuda 2TB', 55.00, 'HDD 7200RPM SATA III para almacenamiento masivo', 30, 'Seagate', H, []],
            ['WD-BLUE-1TB-001', 'SSD Western Digital Blue 1TB', 62.00, 'SSD SATA III 2.5" alta durabilidad', 45, 'Western Digital', H, []],
            ['EVGA-RTX4060-001', 'Placa de Video EVGA RTX 4060', 299.99, 'GPU 8GB GDDR6, ray tracing y DLSS 3', 10, 'EVGA', H, []],
            ['GIGABYTE-B550-001', 'Motherboard Gigabyte B550 AORUS Elite', 139.99, 'Placa madre AM4 con soporte PCIe 4.0', 15, 'Gigabyte', H, []],
            ['COOLERMASTER-HYPER212-001', 'Cooler Cooler Master Hyper 212', 39.99, 'Disipador de CPU por aire con 4 heatpipes', 28, 'Cooler Master', H, []],
            ['NZXT-H510-001', 'Gabinete NZXT H510', 89.99, 'Gabinete ATX mid-tower con panel lateral de vidrio templado', 14, 'NZXT', H, []],
            ['MSI-B450-001', 'Motherboard MSI B450 Tomahawk Max', 109.99, 'Placa madre AM4 con VRM reforzado', 17, 'MSI', H, []]
        ];

        const productos = await Producto.bulkCreate(
            datos.map(([sku, nombre, precio, descripcion, stock, nombreMarca, idCategoria, imagen]) => ({
                sku, nombre, precio, descripcion, stock, imagen,
                idMarca: marca[nombreMarca],
                idCategoria,
                estado: 'activo'
            }))
        );

        // Relación muchos a muchos Producto-Categoría
        await ProductoCategoria.bulkCreate(
            productos.map(p => ({ idProducto: p.id, idCategoria: p.idCategoria }))
        );

        console.log(`🚀 Datos cargados con éxito: ${productos.length} productos.`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Error en el seed:', error.message);
        process.exit(1);
    }
};

ejecutarSeedNube();