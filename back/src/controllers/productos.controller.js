import { Op } from 'sequelize';
import Producto from '../models/productos.model.js';
import Categoria from '../models/categorias.model.js';
import Marca from '../models/marcas.model.js';

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

// Validación reutilizada por crear y actualizar
const validarProducto = (body, esCreacion) => {
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

    if (esCreacion && (!body.imagen || !body.imagen.trim())) {
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

export const crear = async (req, res) => {
    try {
        const errores = validarProducto(req.body, true);
        if (errores.length > 0) {
            return res.status(400).json({ estado: false, mensaje: errores.join(' ') });
        }

        const categoria = await Categoria.findByPk(req.body.idCategoria);
        if (!categoria) {
            return res.status(400).json({ estado: false, mensaje: 'La categoría indicada no existe.' });
        }

        const data = await Producto.create(req.body);
        res.status(201).json({ estado: true, data });
    } catch (error) {
        res.status(400).json({ estado: false, mensaje: 'Error al crear producto', error: error.message });
    }
};

export const actualizar = async (req, res) => {
    try {
        const producto = await Producto.findByPk(parseInt(req.params.id, 10));
        if (!producto) return res.status(404).json({ estado: false, mensaje: 'Producto no encontrado' });

        const errores = validarProducto(req.body, false);
        if (errores.length > 0) {
            return res.status(400).json({ estado: false, mensaje: errores.join(' ') });
        }

        if (req.body.idCategoria) {
            const categoria = await Categoria.findByPk(req.body.idCategoria);
            if (!categoria) {
                return res.status(400).json({ estado: false, mensaje: 'La categoría indicada no existe.' });
            }
        }

        await producto.update(req.body);
        res.json({ estado: true, data: producto });
    } catch (error) {
        res.status(400).json({ estado: false, error: error.message });
    }
};

export const eliminar = async (req, res) => {
    try {
        const producto = await Producto.findByPk(parseInt(req.params.id, 10));
        if (!producto) return res.status(404).json({ estado: false, mensaje: 'Producto no encontrado' });

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
//
// Reemplaza a la versión anterior de obtenerTodosAdmin (que hacía un
// findAll simple sin filtros ni paginación). Se mantiene el mismo nombre
// de función y la misma ruta para no romper lo que ya está conectado.
export const obtenerTodosAdmin = async (req, res) => {
    try {
        console.log('[BACKEND] Parámetros de consulta recibidos en /productos/admin/todos:', req.query);

        // =========================================================================
        // 1. PAGINACIÓN DEL LADO DEL SERVIDOR (Server-Side Pagination)
        // =========================================================================
        const pagina = Math.max(1, parseInt(req.query.pagina, 10) || 1);
        const limite = Math.max(1, parseInt(req.query.limite, 10) || 5);
        const offset = (pagina - 1) * limite;

        // =========================================================================
        // 2. ORDENAMIENTO DINÁMICO (Dynamic Sorting)
        // =========================================================================
        // Lista blanca de columnas permitidas para evitar inyecciones SQL.
        const columnasPermitidas = ['id', 'nombre', 'precio', 'stock'];
        const ordenarPor = columnasPermitidas.includes(req.query.ordenarPor) ? req.query.ordenarPor : 'id';
        const direccion = req.query.direccion?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
        const order = [[ordenarPor, direccion]];

        // =========================================================================
        // 3. FILTROS Y BÚSQUEDA MULTI-CAMPO (Multi-field Search)
        // =========================================================================
        const where = {};

        // Filtro específico por categoría
        if (req.query.idCategoria && req.query.idCategoria.trim() !== '') {
            where.idCategoria = parseInt(req.query.idCategoria, 10);
        }

        // Filtro específico por marca
        if (req.query.idMarca && req.query.idMarca.trim() !== '') {
            where.idMarca = parseInt(req.query.idMarca, 10);
        }

        // Búsqueda multi-campo: un solo término consulta simultáneamente
        // por nombre, sku o descripción mediante Op.or y Op.like (%termino%)
        const busqueda = req.query.busqueda?.trim();
        if (busqueda) {
            where[Op.or] = [
                { nombre: { [Op.like]: `%${busqueda}%` } },
                { sku: { [Op.like]: `%${busqueda}%` } },
                { descripcion: { [Op.like]: `%${busqueda}%` } },
            ];
        }

        // =========================================================================
        // 4. CONSULTA CON findAndCountAll
        // =========================================================================
        // distinct: true garantiza que el conteo no se duplique al hacer JOIN
        // con Categoria y Marca.
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