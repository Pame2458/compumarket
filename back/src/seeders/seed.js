// src/seeders/ecommerce.seeder.extra.js
import Marca from '../models/marcas.model.js';
import Categoria from '../models/categorias.model.js';
import Producto from '../models/productos.model.js';

export const seedProductosExtra = async () => {
    try {
        console.log('🌱 Iniciando Seeding adicional de productos...');

        // MARCAS (findOrCreate: reutiliza las que ya existen)
        const marcas = {};
        const nombresMarcas = [
            'ASUS', 'Logitech', 'Corsair', 'HP', 'Razer', 'Kingston',
            'Dell', 'Lenovo', 'Acer', 'MSI', 'Samsung',
            'SteelSeries', 'HyperX', 'Cooler Master', 'Seagate',
            'Western Digital', 'EVGA', 'Gigabyte', 'NZXT', 'JBL',
        ];
        for (const nombre of nombresMarcas) {
            const [marca] = await Marca.findOrCreate({ where: { nombre }, defaults: { estado: 'activo' } });
            marcas[nombre] = marca;
        }

        // CATEGORÍAS (findOrCreate)
        const [catLaptops] = await Categoria.findOrCreate({ where: { nombre: 'Laptops' }, defaults: { descripcion: 'Notebooks y Portátiles' } });
        const [catPerifericos] = await Categoria.findOrCreate({ where: { nombre: 'Periféricos' }, defaults: { descripcion: 'Teclados, ratones y audio' } });
        const [catHardware] = await Categoria.findOrCreate({ where: { nombre: 'Hardware' }, defaults: { descripcion: 'Componentes internos y PC' } });

        const productos = [
            // ---------- LAPTOPS (10) ----------
            { sku: 'HP-PAV-15-002', nombre: 'Laptop HP Pavilion 15', precio: 799.99, descripcion: 'Intel Core i5, 16GB RAM, SSD 512GB', imagen: ['pavilion15_1.jpg'], stock: 20, marca: 'HP', cat: catLaptops },
            { sku: 'DELL-INSP-14-001', nombre: 'Laptop Dell Inspiron 14', precio: 649.99, descripcion: 'Intel Core i3, 8GB RAM, SSD 256GB', imagen: ['inspiron14.jpg'], stock: 22, marca: 'Dell', cat: catLaptops },
            { sku: 'LENOVO-IP5-001', nombre: 'Laptop Lenovo IdeaPad 5', precio: 729.00, descripcion: 'AMD Ryzen 7, 16GB RAM, SSD 512GB', imagen: ['ideapad5.jpg'], stock: 18, marca: 'Lenovo', cat: catLaptops },
            { sku: 'ACER-ASPIRE5-001', nombre: 'Laptop Acer Aspire 5', precio: 599.99, descripcion: 'Intel Core i5, 8GB RAM, SSD 512GB', imagen: ['aspire5.jpg'], stock: 25, marca: 'Acer', cat: catLaptops },
            { sku: 'MSI-KATANA15-001', nombre: 'Laptop MSI Katana 15', precio: 1199.00, descripcion: 'Intel i7, 16GB RAM, RTX 4060', imagen: ['katana15.jpg'], stock: 12, marca: 'MSI', cat: catLaptops },
            { sku: 'ASUS-VIVOBOOK-001', nombre: 'Laptop ASUS Vivobook 15', precio: 549.99, descripcion: 'Intel Core i3, 8GB RAM, SSD 256GB', imagen: ['vivobook15.jpg'], stock: 30, marca: 'ASUS', cat: catLaptops },
            { sku: 'SAMSUNG-GALBOOK3-001', nombre: 'Laptop Samsung Galaxy Book3', precio: 899.00, descripcion: 'Intel Core i5, 16GB RAM, SSD 512GB', imagen: ['galbook3.jpg'], stock: 15, marca: 'Samsung', cat: catLaptops },
            { sku: 'LENOVO-LEGION5-001', nombre: 'Laptop Lenovo Legion 5', precio: 1299.99, descripcion: 'Ryzen 7, 32GB RAM, RTX 4070', imagen: ['legion5.jpg'], stock: 10, marca: 'Lenovo', cat: catLaptops },
            { sku: 'ACER-SWIFT3-001', nombre: 'Laptop Acer Swift 3', precio: 679.99, descripcion: 'Intel Core i5, 8GB RAM, SSD 512GB, ultraliviana', imagen: ['swift3.jpg'], stock: 20, marca: 'Acer', cat: catLaptops },
            { sku: 'HP-OMEN16-001', nombre: 'Laptop HP Omen 16', precio: 1349.00, descripcion: 'Intel i7, 16GB RAM, RTX 4060', imagen: ['omen16.jpg'], stock: 9, marca: 'HP', cat: catLaptops },

            // ---------- PERIFÉRICOS (10) ----------
            { sku: 'RAZER-VIPMINI-001', nombre: 'Mouse Razer Viper Mini', precio: 39.99, descripcion: 'Mouse gamer liviano, sensor óptico de alta precisión', imagen: ['viper_mini.jpg'], stock: 35, marca: 'Razer', cat: catPerifericos },
            { sku: 'LOGI-K380-001', nombre: 'Teclado Logitech K380', precio: 34.99, descripcion: 'Teclado inalámbrico multidispositivo Bluetooth', imagen: ['k380.jpg'], stock: 30, marca: 'Logitech', cat: catPerifericos },
            { sku: 'HYPERX-CLOUD2-001', nombre: 'Auriculares HyperX Cloud II', precio: 89.99, descripcion: 'Headset gamer con sonido envolvente 7.1', imagen: ['cloud2.jpg'], stock: 25, marca: 'HyperX', cat: catPerifericos },
            { sku: 'STEEL-APEX3-001', nombre: 'Teclado SteelSeries Apex 3', precio: 59.99, descripcion: 'Teclado mecánico con retroiluminación RGB', imagen: ['apex3.jpg'], stock: 28, marca: 'SteelSeries', cat: catPerifericos },
            { sku: 'CORSAIR-K55-001', nombre: 'Teclado Corsair K55 RGB', precio: 49.99, descripcion: 'Teclado gamer con teclas de acceso rápido programables', imagen: ['k55.jpg'], stock: 20, marca: 'Corsair', cat: catPerifericos },
            { sku: 'LOGI-C920-001', nombre: 'Webcam Logitech C920', precio: 69.99, descripcion: 'Webcam Full HD 1080p con micrófono estéreo', imagen: ['c920.jpg'], stock: 32, marca: 'Logitech', cat: catPerifericos },
            { sku: 'RAZER-KRAKENX-001', nombre: 'Auriculares Razer Kraken X', precio: 49.99, descripcion: 'Headset liviano con sonido envolvente 7.1', imagen: ['krakenx.jpg'], stock: 27, marca: 'Razer', cat: catPerifericos },
            { sku: 'JBL-QUANTUM100-001', nombre: 'Auriculares JBL Quantum 100', precio: 29.99, descripcion: 'Headset gamer con sonido JBL QuantumSOUND', imagen: ['quantum100.jpg'], stock: 40, marca: 'JBL', cat: catPerifericos },
            { sku: 'STEEL-RIVAL3-001', nombre: 'Mouse SteelSeries Rival 3', precio: 29.99, descripcion: 'Mouse gamer con iluminación RGB Prism', imagen: ['rival3.jpg'], stock: 33, marca: 'SteelSeries', cat: catPerifericos },
            { sku: 'CORSAIR-M65-001', nombre: 'Mouse Corsair M65 RGB Elite', precio: 59.99, descripcion: 'Mouse gamer con peso ajustable y sensor de 18000 DPI', imagen: ['m65.jpg'], stock: 22, marca: 'Corsair', cat: catPerifericos },

            // ---------- HARDWARE (10) ----------
            { sku: 'KING-SSD-1TB-001', nombre: 'SSD Kingston NV2 1TB NVMe', precio: 65.00, descripcion: 'Unidad de estado sólido NVMe PCIe 4.0', imagen: ['kingston_ssd.jpg'], stock: 50, marca: 'Kingston', cat: catHardware },
            { sku: 'CORSAIR-PSU-750-001', nombre: 'Fuente Corsair RM750x 750W 80+ Gold', precio: 110.00, descripcion: 'Fuente modular certificada 80+ Gold', imagen: ['corsair_psu.jpg'], stock: 18, marca: 'Corsair', cat: catHardware },
            { sku: 'CORSAIR-VENG16-001', nombre: 'Memoria RAM Corsair Vengeance 16GB DDR4', precio: 45.00, descripcion: 'Kit de 2x8GB 3200MHz CL16', imagen: ['vengeance16.jpg'], stock: 40, marca: 'Corsair', cat: catHardware },
            { sku: 'SEAGATE-BARRACUDA-2TB-001', nombre: 'Disco Rígido Seagate Barracuda 2TB', precio: 55.00, descripcion: 'HDD 7200RPM SATA III para almacenamiento masivo', imagen: ['barracuda2tb.jpg'], stock: 30, marca: 'Seagate', cat: catHardware },
            { sku: 'WD-BLUE-1TB-001', nombre: 'SSD Western Digital Blue 1TB', precio: 62.00, descripcion: 'SSD SATA III 2.5" alta durabilidad', imagen: ['wdblue1tb.jpg'], stock: 45, marca: 'Western Digital', cat: catHardware },
            { sku: 'EVGA-RTX4060-001', nombre: 'Placa de Video EVGA RTX 4060', precio: 299.99, descripcion: 'GPU 8GB GDDR6, ray tracing y DLSS 3', imagen: ['rtx4060.jpg'], stock: 10, marca: 'EVGA', cat: catHardware },
            { sku: 'GIGABYTE-B550-001', nombre: 'Motherboard Gigabyte B550 AORUS Elite', precio: 139.99, descripcion: 'Placa madre AM4 con soporte PCIe 4.0', imagen: ['b550aorus.jpg'], stock: 15, marca: 'Gigabyte', cat: catHardware },
            { sku: 'COOLERMASTER-HYPER212-001', nombre: 'Cooler Cooler Master Hyper 212', precio: 39.99, descripcion: 'Disipador de CPU por aire con 4 heatpipes', imagen: ['hyper212.jpg'], stock: 28, marca: 'Cooler Master', cat: catHardware },
            { sku: 'NZXT-H510-001', nombre: 'Gabinete NZXT H510', precio: 89.99, descripcion: 'Gabinete ATX mid-tower con panel lateral de vidrio templado', imagen: ['h510.jpg'], stock: 14, marca: 'NZXT', cat: catHardware },
            { sku: 'MSI-B450-001', nombre: 'Motherboard MSI B450 Tomahawk Max', precio: 109.99, descripcion: 'Placa madre AM4 con VRM reforzado', imagen: ['b450tomahawk.jpg'], stock: 17, marca: 'MSI', cat: catHardware },
        ];

        for (const p of productos) {
            await Producto.findOrCreate({
                where: { sku: p.sku },
                defaults: {
                    nombre: p.nombre,
                    precio: p.precio,
                    descripcion: p.descripcion,
                    imagen: JSON.stringify(p.imagen),
                    stock: p.stock,
                    idMarca: marcas[p.marca].id,
                    idCategoria: p.cat.id,
                },
            });
        }

        console.log('✅ 30 productos adicionales (10 por categoría) cargados con éxito.');
    } catch (error) {
        console.error('❌ Error en el seeder adicional:', error);
    }
};