// productosService.js
const {neon} = require('@neondatabase/serverless');
const multer = require("multer");
const {v4: uuidv4} = require("uuid");
const sql = neon(process.env.DATABASE_URL);

async function getProductById(id) {
    try {
        const [product] = await sql`
            SELECT id,
                   name,
                   price,
                   stock,
                   category,
                   description,
                   content,
                   image_url
            FROM products
            WHERE active = true
              AND id = ${id}
        `;

        if (product) {
            return product;

        }
        return {"message": "product not found"};
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        throw error;
    }
}

async function getProducts() {
    return sql`SELECT id,
                      name,
                      price,
                      stock,
                      category,
                      description,
                      content,
                      image_url
               FROM products
               WHERE active = true`;

}

async function deleteProductById(id) {
    console.log("delete Product id ", id)
    try {
        await sql`update products
                  set active = false
                  where id = ${id};`;
        return  { message: 'Producto eliminado exitosamente.' };
    } catch (error) {
        return { message: 'Error al eliminar el producto.' };
    }
}

async function activeProductById(id) {
    console.log("delete Product id ", id)
    try {
        await sql`update products
                  set active = true
                  where id = ${id};`;
        return  { message: 'Producto activado exitosamente.' };
    } catch (error) {
        return { message: 'Error al activar el producto.' };
    }
}




const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Establece el directorio de almacenamiento para las imágenes
        cb(null, './public/images/ProductosNuevos');
    },
    filename: (req, file, cb) => {
        // Generar un UUID y agregar la extensión del archivo original
        const uniqueName = `${uuidv4()}${getExtension(file.originalname)}`;
        cb(null, uniqueName);
    }
});

// Crear middleware de `multer` para manejar la carga de imágenes
const upload = multer({ storage: storage });

// Función para obtener la extensión del archivo
function getExtension(filename) {
    return filename.substring(filename.lastIndexOf('.'));
}

module.exports = {getProductById, getProducts, deleteProductById, activeProductById};
