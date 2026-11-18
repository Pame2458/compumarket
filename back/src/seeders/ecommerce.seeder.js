// src/seeders/ecommerce.seeder.js - Datos iniciales de compuMarket.
// Usa findOrCreate: si se corre dos veces, no duplica nada.
import Rol from '../models/roles.model.js';
import Usuario from '../models/usuarios.model.js';
import Cliente from '../models/clientes.model.js';
import Domicilio from '../models/domicilios.model.js';
import Marca from '../models/marcas.model.js';
import Categoria from '../models/categorias.model.js';
import Producto from '../models/productos.model.js';

// Precios en pesos argentinos (aproximados, ajustalos a gusto).
// Las imágenes quedan vacías: se cargan desde el panel admin (Productos > editar).
const PRODUCTOS = [
    // ---------- LAPTOPS ----------
    { sku: 'ASUS-ROG-ZEPH-001', nombre: 'Laptop ASUS ROG Zephyrus', precio: 4199000, descripcion: 'Notebook gamer Ryzen 9, 32GB RAM, RTX 4070', stock: 8, marca: 'ASUS', cat: 'Laptops' },
    { sku: 'HP-PAV-15-002', nombre: 'Laptop HP Pavilion 15', precio: 1399000, descripcion: 'Intel Core i5, 16GB RAM, SSD 512GB', stock: 20, marca: 'HP', cat: 'Laptops' },
    { sku: 'DELL-INSP-14-001', nombre: 'Laptop Dell Inspiron 14', precio: 899000, descripcion: 'Intel Core i3, 8GB RAM, SSD 256GB', stock: 22, marca: 'Dell', cat: 'Laptops' },
    { sku: 'LENOVO-IP5-001', nombre: 'Laptop Lenovo IdeaPad 5', precio: 1249000, descripcion: 'AMD Ryzen 7, 16GB RAM, SSD 512GB', stock: 18, marca: 'Lenovo', cat: 'Laptops' },
    { sku: 'ACER-ASPIRE5-001', nombre: 'Laptop Acer Aspire 5', precio: 989000, descripcion: 'Intel Core i5, 8GB RAM, SSD 512GB', stock: 25, marca: 'Acer', cat: 'Laptops' },
    { sku: 'MSI-KATANA15-001', nombre: 'Laptop MSI Katana 15', precio: 2499000, descripcion: 'Intel i7, 16GB RAM, RTX 4060', stock: 12, marca: 'MSI', cat: 'Laptops' },
    { sku: 'ASUS-VIVOBOOK-001', nombre: 'Laptop ASUS Vivobook 15', precio: 829000, descripcion: 'Intel Core i3, 8GB RAM, SSD 256GB', stock: 30, marca: 'ASUS', cat: 'Laptops' },
    { sku: 'SAMSUNG-GALBOOK3-001', nombre: 'Laptop Samsung Galaxy Book3', precio: 1549000, descripcion: 'Intel Core i5, 16GB RAM, SSD 512GB', stock: 15, marca: 'Samsung', cat: 'Laptops' },
    { sku: 'LENOVO-LEGION5-001', nombre: 'Laptop Lenovo Legion 5', precio: 3199000, descripcion: 'Ryzen 7, 32GB RAM, RTX 4070', stock: 10, marca: 'Lenovo', cat: 'Laptops' },
    { sku: 'ACER-SWIFT3-001', nombre: 'Laptop Acer Swift 3', precio: 1179000, descripcion: 'Intel Core i5, 8GB RAM, SSD 512GB, ultraliviana', stock: 20, marca: 'Acer', cat: 'Laptops' },

    // ---------- PERIFÉRICOS ----------
    { sku: 'LOGI-GPROX-001', nombre: 'Mouse Logitech G Pro X Superlight', precio: 219000, descripcion: 'Mouse inalámbrico ultra liviano para esports', stock: 40, marca: 'Logitech', cat: 'Periféricos' },
    { sku: 'RAZER-VIPMINI-001', nombre: 'Mouse Razer Viper Mini', precio: 59000, descripcion: 'Mouse gamer liviano, sensor óptico de alta precisión', stock: 35, marca: 'Razer', cat: 'Periféricos' },
    { sku: 'LOGI-K380-001', nombre: 'Teclado Logitech K380', precio: 69000, descripcion: 'Teclado inalámbrico multidispositivo Bluetooth', stock: 30, marca: 'Logitech', cat: 'Periféricos' },
    { sku: 'HYPERX-CLOUD2-001', nombre: 'Auriculares HyperX Cloud II', precio: 169000, descripcion: 'Headset gamer con sonido envolvente 7.1', stock: 25, marca: 'HyperX', cat: 'Periféricos' },
    { sku: 'STEEL-APEX3-001', nombre: 'Teclado SteelSeries Apex 3', precio: 109000, descripcion: 'Teclado con retroiluminación RGB y resistencia al agua', stock: 28, marca: 'SteelSeries', cat: 'Periféricos' },
    { sku: 'CORSAIR-K55-001', nombre: 'Teclado Corsair K55 RGB', precio: 89000, descripcion: 'Teclado gamer con teclas de acceso rápido programables', stock: 20, marca: 'Corsair', cat: 'Periféricos' },
    { sku: 'LOGI-C920-001', nombre: 'Webcam Logitech C920', precio: 129000, descripcion: 'Webcam Full HD 1080p con micrófono estéreo', stock: 32, marca: 'Logitech', cat: 'Periféricos' },
    { sku: 'RAZER-KRAKENX-001', nombre: 'Auriculares Razer Kraken X', precio: 89000, descripcion: 'Headset liviano con sonido envolvente 7.1', stock: 27, marca: 'Razer', cat: 'Periféricos' },
    { sku: 'JBL-QUANTUM100-001', nombre: 'Auriculares JBL Quantum 100', precio: 55000, descripcion: 'Headset gamer con sonido JBL QuantumSOUND', stock: 40, marca: 'JBL', cat: 'Periféricos' },
    { sku: 'STEEL-RIVAL3-001', nombre: 'Mouse SteelSeries Rival 3', precio: 49000, descripcion: 'Mouse gamer con iluminación RGB Prism', stock: 33, marca: 'SteelSeries', cat: 'Periféricos' },

    // ---------- HARDWARE ----------
    { sku: 'CORSAIR-DDR5-32-001', nombre: 'Memoria RAM Corsair Vengeance DDR5 32GB', precio: 199000, descripcion: 'Kit de 2x16GB 6000MHz CL36', stock: 25, marca: 'Corsair', cat: 'Hardware' },
    { sku: 'KING-SSD-1TB-001', nombre: 'SSD Kingston NV2 1TB NVMe', precio: 109000, descripcion: 'Unidad de estado sólido NVMe PCIe 4.0', stock: 50, marca: 'Kingston', cat: 'Hardware' },
    { sku: 'CORSAIR-PSU-750-001', nombre: 'Fuente Corsair RM750x 750W 80+ Gold', precio: 219000, descripcion: 'Fuente modular certificada 80+ Gold', stock: 18, marca: 'Corsair', cat: 'Hardware' },
    { sku: 'CORSAIR-VENG16-001', nombre: 'Memoria RAM Corsair Vengeance 16GB DDR4', precio: 79000, descripcion: 'Kit de 2x8GB 3200MHz CL16', stock: 40, marca: 'Corsair', cat: 'Hardware' },
    { sku: 'SEAGATE-BARRACUDA-2TB-001', nombre: 'Disco Rígido Seagate Barracuda 2TB', precio: 99000, descripcion: 'HDD 7200RPM SATA III para almacenamiento masivo', stock: 30, marca: 'Seagate', cat: 'Hardware' },
    { sku: 'WD-BLUE-1TB-001', nombre: 'SSD Western Digital Blue 1TB', precio: 119000, descripcion: 'SSD SATA III 2.5" de alta durabilidad', stock: 45, marca: 'Western Digital', cat: 'Hardware' },
    { sku: 'EVGA-RTX4060-001', nombre: 'Placa de Video EVGA RTX 4060', precio: 649000, descripcion: 'GPU 8GB GDDR6, ray tracing y DLSS 3', stock: 10, marca: 'EVGA', cat: 'Hardware' },
    { sku: 'GIGABYTE-B550-001', nombre: 'Motherboard Gigabyte B550 AORUS Elite', precio: 259000, descripcion: 'Placa madre AM4 con soporte PCIe 4.0', stock: 15, marca: 'Gigabyte', cat: 'Hardware' },
    { sku: 'COOLERMASTER-HYPER212-001', nombre: 'Cooler Master Hyper 212', precio: 69000, descripcion: 'Disipador de CPU por aire con 4 heatpipes', stock: 28, marca: 'Cooler Master', cat: 'Hardware' },
    { sku: 'NZXT-H510-001', nombre: 'Gabinete NZXT H510', precio: 169000, descripcion: 'Gabinete ATX mid-tower con panel lateral de vidrio templado', stock: 14, marca: 'NZXT', cat: 'Hardware' },
];

export const seedComputacion = async () => {
    try {
        console.log('🌱 Iniciando seed de compuMarket...');

        // 1. ROLES
        const [rolAdmin] = await Rol.findOrCreate({ where: { nombre: 'Administrador' }, defaults: { estado: 'activo' } });
        const [rolOperador] = await Rol.findOrCreate({ where: { nombre: 'Operador' }, defaults: { estado: 'activo' } });

        // 2. USUARIOS DEL PANEL (cambiá las contraseñas si querés)
        await Usuario.findOrCreate({
            where: { email: 'admin@compumarket.com' },
            defaults: {
                nombre: 'Administrador', apellido: 'compuMarket', password: 'Admin-2026',
                telefono: '1122334455', direccion: 'Av. Tech 404', rolId: rolAdmin.id,
            },
        });
        await Usuario.findOrCreate({
            where: { email: 'operador@compumarket.com' },
            defaults: {
                nombre: 'Operador', apellido: 'compuMarket', password: 'Operador-2026',
                telefono: '1166778899', direccion: 'Av. Tech 405', rolId: rolOperador.id,
            },
        });

        // 3. CLIENTE DE PRUEBA con su domicilio (cambiá el email por uno tuyo para recibir los correos)
        const [cliente] = await Cliente.findOrCreate({
            where: { email: 'cliente@compumarket.com' },
            defaults: {
                nombre: 'Juan', apellido: 'Pérez', telefono: '1155550101',
                password: 'Cliente-2026', emailVerificado: true,
            },
        });
        await Domicilio.findOrCreate({
            where: { idCliente: cliente.id },
            defaults: {
                calle: 'Calle Binaria', numero: '101', ciudad: 'Córdoba',
                codigoPostal: '5000', departamento: 'A', piso: '1',
            },
        });

        // 4. MARCAS Y CATEGORÍAS (salen de la lista de productos, sin repetir)
        const marcas = {};
        for (const nombre of [...new Set(PRODUCTOS.map((p) => p.marca))]) {
            const [marca] = await Marca.findOrCreate({ where: { nombre }, defaults: { estado: 'activo' } });
            marcas[nombre] = marca;
        }

        const descripcionesCategorias = {
            Laptops: 'Notebooks y portátiles',
            'Periféricos': 'Teclados, ratones y audio',
            Hardware: 'Componentes internos y PC',
        };
        const categorias = {};
        for (const [nombre, descripcion] of Object.entries(descripcionesCategorias)) {
            const [categoria] = await Categoria.findOrCreate({ where: { nombre }, defaults: { descripcion } });
            categorias[nombre] = categoria;
        }

        // 5. PRODUCTOS (sin imágenes: se cargan desde el panel admin)
        for (const p of PRODUCTOS) {
            await Producto.findOrCreate({
                where: { sku: p.sku },
                defaults: {
                    nombre: p.nombre,
                    precio: p.precio,
                    descripcion: p.descripcion,
                    imagen: JSON.stringify([]),
                    stock: p.stock,
                    idMarca: marcas[p.marca].id,
                    idCategoria: categorias[p.cat].id,
                },
            });
        }

        console.log('✅ Seed completo: 2 roles, 2 usuarios del panel, 1 cliente y 30 productos.');
    } catch (error) {
        console.error('❌ Error en el seed:', error);
    }
};