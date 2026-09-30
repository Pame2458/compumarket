import multer from 'multer';
import path from 'path';
import fs from 'fs';

const carpeta = 'uploads/productos';
fs.mkdirSync(carpeta, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, carpeta),
    filename: (req, file, cb) => {
        const nombreUnico = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, nombreUnico + path.extname(file.originalname));
    },
});

const fileFilter = (req, file, cb) => {
    const permitidos = ['image/jpeg', 'image/png', 'image/webp'];
    if (permitidos.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Solo se permiten imágenes JPG, PNG o WEBP.'));
};

export const uploadProductos = multer({
    storage,
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB por imagen
});