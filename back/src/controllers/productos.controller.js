import { Op } from 'sequelize';
import fs from 'fs';
import path from 'path';
import Producto from '../models/productos.model.js';
import Categoria from '../models/categorias.model.js';
import Marca from '../models/marcas.model.js';

const MAX_IMAGENES = 5;

// =========================================================================
// HELPERS PARA IMÁGENES (multer)
// =========================================================================

// Convierte lo que multer dejó en req.files en rutas públicas: ["/uploads/productos/123.jpg", ...]
const rutasDeArchivos = (files) =>
    (files || []).map((f) => `/uploads/productos/${f.filename}`);

// Borra del disco archivos recién subidos (se usa si la validación falla,
// para no dejar imágenes huérfanas en la carpeta uploads).
const borrarSubidos = (files) => {
    (files || []).forEach((f) => fs.unlink(f.path, () => { }));
};

// Borra del disco una lista de rutas (solo las subidas por multer;
// las URLs externas, como las del seeder, se ignoran).
const borrarImagenes = (rutas) => {
    (rutas || [])
        .filter((ruta) => typeof ruta === 'string' && ruta.startsWith('/uploads/'))
        .forEach((ruta) => fs.unlink(path.join(process.cwd(), ruta), () => { }));
};

// =========================================================================
// LECTURA
// =========================================================================

export const obtener = async (req, res) => {
    try {
        const { idMarca, idCategoria } = req.query;
        const condiciones = { estado: 'activo' };
        if (idMarca) condiciones.idMarca = parseInt(idMarca, 10);
        if (idCategoria) condiciones.idCategoria = parseInt(idCategoria, 10);

        const data = await Producto.findAll({
            where: condiciones,
            include: [{ model: Marca }, { model: Categoria }]
        });
        res.json({ estado: true, data });
    } catch (error) {
        res.status(500).json({ estado: false, mensaje: 'Error al obtener productos', error: error.message });
    }
};

export const obtenerPorId = async (req, res) => {
    try {
        const data = await Producto.findByPk(parseInt(req.params.id, 10), {
            include: [{ model: Marca }, { model: Categoria }]
        });
        if (!data) return res.status(404).json({ estado: false, mensaje: 'Producto no encontrado' });
        res.json({ estado: true, data });
    } catch (error) {
        res.status(500).json({ estado: false, error: error.message });
    }
};

// =========================================================================
// VALIDACIÓN (reutilizada por crear y actualizar)
// =========================================================================
// hayImagenes indica si en este request llegaron archivos por multer.
const validarProducto = (body, esCreacion, hayImagenes) => {
    const errores = [];

    if (esCreacion && (!body.nombre || !body.nombre.trim())) {
        errores.push('El nombre es obligatorio.');
    }

    if (body.precio !== undefined) {
        const precio = Number(body.precio);
        if (isNaN(precio) || precio <= 0) {
            errores.push('El precio debe ser un número mayor a 0.');
        }
    } else if (esCreacion) {
        errores.push('El precio es obligatorio.');
    }

    if (body.stock !== undefined) {
        const stock = Number(body.stock);
        if (isNaN(stock) || stock < 0 || !Number.isInteger(stock)) {
            errores.push('El stock debe ser un número entero mayor o igual a 0.');
        }
    }

    // Al crear, tiene que haber al menos una imagen subida
    if (esCreacion && !hayImagenes) {
        errores.push('La imagen es obligatoria.');
    }

    if (esCreacion && !body.idCategoria) {
        errores.push('La categoría es obligatoria.');
    }

    if (esCreacion && !body.idMarca) {
        errores.push('La marca es obligatoria.');
    }

    return errores;
};

// =========================================================================
// ESCRITURA
// =========================================================================

export const crear = async (req, res) => {
    const imagenes = rutasDeArchivos(req.files);

    try {
        const errores = validarProducto(req.body, true, imagenes.length > 0);
        if (errores.length > 0) {
            borrarSubidos(req.files);
            return res.status(400).json({ estado: false, mensaje: errores.join(' ') });
        }

        const categoria = await Categoria.findByPk(req.body.idCategoria);
        if (!categoria) {
            borrarSubidos(req.files);
            return res.status(400).json({ estado: false, mensaje: 'La categoría indicada no existe.' });
        }

        // Se ignora cualquier "imagen" que venga en el body: la fuente son los archivos subidos.
        const datos = { ...req.body, imagen: imagenes };

        const data = await Producto.create(datos);
        res.status(201).json({ estado: true, data });
    } catch (error) {
        borrarSubidos(req.files);
        res.status(400).json({ estado: false, mensaje: 'Error al crear producto', error: error.message });
    }
};

// actualizar recibe por multipart:
// - los campos de texto del producto,
// - "imagenesConservar": un JSON con las rutas de las imágenes actuales que se mantienen,
// - "imagenes": los archivos nuevos (opcional).
// La lista final de imágenes es: conservadas + nuevas.
// Si el request no trae "imagenesConservar" ni archivos, las imágenes quedan como estaban.
export const actualizar = async (req, res) => {
    const nuevas = rutasDeArchivos(req.files);

    try {
        const producto = await Producto.findByPk(parseInt(req.params.id, 10));
        if (!producto) {
            borrarSubidos(req.files);
            return res.status(404).json({ estado: false, mensaje: 'Producto no encontrado' });
        }

        const errores = validarProducto(req.body, false, nuevas.length > 0);
        if (errores.length > 0) {
            borrarSubidos(req.files);
            return res.status(400).json({ estado: false, mensaje: errores.join(' ') });
        }

        if (req.body.idCategoria) {
            const categoria = await Categoria.findByPk(req.body.idCategoria);
            if (!categoria) {
                borrarSubidos(req.files);
                return res.status(400).json({ estado: false, mensaje: 'La categoría indicada no existe.' });
            }
        }

        // Rutas de imágenes que el front quiere conservar (si las mandó)
        let conservar = null;
        if (req.body.imagenesConservar !== undefined) {
            try {
                const parsed = JSON.parse(req.body.imagenesConservar);
                conservar = Array.isArray(parsed) ? parsed : null;
            } catch {
                conservar = null;
            }
            if (conservar === null) {
                borrarSubidos(req.files);
                return res.status(400).json({ estado: false, mensaje: 'La lista de imágenes a conservar no es válida.' });
            }
        }

        const datos = { ...req.body };
        delete datos.imagen;
        delete datos.imagenesConservar;

        const imagenesViejas = producto.imagen; // el modelo siempre devuelve un array
        let imagenesFinales = null;

        if (conservar !== null || nuevas.length > 0) {
            // Solo se conservan rutas que realmente pertenecían al producto
            // (así el cliente no puede inyectar rutas arbitrarias).
            const base = conservar !== null
                ? conservar.filter((ruta) => imagenesViejas.includes(ruta))
                : [];
            imagenesFinales = [...base, ...nuevas];

            if (imagenesFinales.length === 0) {
                borrarSubidos(req.files);
                return res.status(400).json({ estado: false, mensaje: 'El producto debe tener al menos una imagen.' });
            }
            if (imagenesFinales.length > MAX_IMAGENES) {
                borrarSubidos(req.files);
                return res.status(400).json({ estado: false, mensaje: `Un producto puede tener hasta ${MAX_IMAGENES} imágenes.` });
            }

            datos.imagen = imagenesFinales;
        }

        await producto.update(datos);

        // Borra del disco las imágenes que ya no están en el producto
        if (imagenesFinales) {
            borrarImagenes(imagenesViejas.filter((ruta) => !imagenesFinales.includes(ruta)));
        }

        res.json({ estado: true, data: producto });
    } catch (error) {
        borrarSubidos(req.files);
        res.status(400).json({ estado: false, error: error.message });
    }
};

export const eliminar = async (req, res) => {
    try {
        const producto = await Producto.findByPk(parseInt(req.params.id, 10));
        if (!producto) return res.status(404).json({ estado: false, mensaje: 'Producto no encontrado' });

        // Borrado lógico: las imágenes se conservan porque el producto se puede reactivar.
        await producto.update({ estado: 'descontinuado' });
        res.json({ estado: true, mensaje: 'Producto descontinuado correctamente' });
    } catch (error) {
        res.status(500).json({ estado: false, error: error.message });
    }
};

// GET /productos/admin/todos -> lista TODOS los productos (cualquier estado),
// solo para el panel admin, con:
// - Paginación en servidor (limit y offset con findAndCountAll).
// - Ordenamiento dinámico por columna y dirección (ASC/DESC).
// - Búsqueda multi-campo en un solo término (nombre, sku, descripción).
// - Filtros opcionales por idCategoria e idMarca.
export const obtenerTodosAdmin = async (req, res) => {
    try {
        console.log('[BACKEND] Parámetros de consulta recibidos en /productos/admin/todos:', req.query);

        // 1. PAGINACIÓN DEL LADO DEL SERVIDOR
        const pagina = Math.max(1, parseInt(req.query.pagina, 10) || 1);
        const limite = Math.max(1, parseInt(req.query.limite, 10) || 5);
        const offset = (pagina - 1) * limite;

        // 2. ORDENAMIENTO DINÁMICO
        // Lista blanca de columnas permitidas para evitar inyecciones SQL.
        const columnasPermitidas = ['id', 'nombre', 'precio', 'stock'];
        const ordenarPor = columnasPermitidas.includes(req.query.ordenarPor) ? req.query.ordenarPor : 'id';
        const direccion = req.query.direccion?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
        const order = [[ordenarPor, direccion]];

        // 3. FILTROS Y BÚSQUEDA MULTI-CAMPO
        const where = {};

        if (req.query.idCategoria && req.query.idCategoria.trim() !== '') {
            where.idCategoria = parseInt(req.query.idCategoria, 10);
        }

        if (req.query.idMarca && req.query.idMarca.trim() !== '') {
            where.idMarca = parseInt(req.query.idMarca, 10);
        }

        const busqueda = req.query.busqueda?.trim();
        if (busqueda) {
            where[Op.or] = [
                { nombre: { [Op.like]: `%${busqueda}%` } },
                { sku: { [Op.like]: `%${busqueda}%` } },
                { descripcion: { [Op.like]: `%${busqueda}%` } },
            ];
        }

        // 4. CONSULTA CON findAndCountAll
        // distinct: true garantiza que el conteo no se duplique al hacer JOIN.
        const { count, rows } = await Producto.findAndCountAll({
            where,
            include: [{ model: Marca }, { model: Categoria }],
            order,
            limit: limite,
            offset: offset,
            distinct: true,
        });

        const totalPaginas = Math.ceil(count / limite) || 1;

        console.log(`[BACKEND] Total productos encontrados: ${count}. Enviando página ${pagina} de ${totalPaginas}`);

        res.json({
            estado: true,
            data: {
                productos: rows,
                total: count,
                pagina,
                limite,
                totalPaginas,
            },
        });
    } catch (error) {
        console.error('[BACKEND] Error al listar productos (admin):', error);
        res.status(500).json({
            estado: false,
            mensaje: 'Error al listar productos',
            error: error.message,
        });
    }
};