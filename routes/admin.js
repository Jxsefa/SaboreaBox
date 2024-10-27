const express = require('express');
const router = express.Router();
const { neon } = require('@neondatabase/serverless');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');


// Conectar a la base de datos Neon
const sql = neon(process.env.DATABASE_URL);

// Ruta del Dashboard de Administración (GET /admin)
router.get('/', async (req, res) => {
    try {
        const totalVentasResult = await sql`
            SELECT SUM(total_amount) AS total
            FROM orders
            WHERE EXTRACT(MONTH FROM created_at) = EXTRACT(MONTH FROM CURRENT_DATE)
        `;
        const totalVentas = totalVentasResult[0]?.total || 0;

        const productosVendidosResult = await sql`
            SELECT SUM(od.quantity) AS total
            FROM order_details od
                     JOIN orders o ON od.order_id = o.id
            WHERE EXTRACT(MONTH FROM o.created_at) = EXTRACT(MONTH FROM CURRENT_DATE)
        `;
        const productosVendidos = productosVendidosResult[0]?.total || 0;

        const usuariosActivosResult = await sql`
            SELECT COUNT(DISTINCT user_id) AS total
            FROM orders
            WHERE EXTRACT(MONTH FROM created_at) = EXTRACT(MONTH FROM CURRENT_DATE)
        `;
        const usuariosActivos = usuariosActivosResult[0]?.total || 0;

        // Obtener productos utilizando la función getProducts
        const products = await getProducts();

        console.log("datos: ", totalVentas, productosVendidos, usuariosActivos);

        // Renderizar la vista de administración con los datos del dashboard
        res.render('admin', {
            title: 'Administración',
            totalVentas,
            productosVendidos,
            usuariosActivos,
            products
        });
    } catch (error) {
        console.error('Error al obtener datos del Dashboard:', error);
        res.status(500).send(`Error en el servidor: ${error.message}`);
    }
});

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

// Ruta para guardar un producto con imagen
router.post('/save', upload.single('imagen'), async (req, res) => {
    const { id, name, price, stock, category, description, content, urlImg } = req.body;

    console.log("Datos del formulario:", req.body);


    console.log(urlImg)
    console.log(id)
    console.log(description, "  ", content)
    let imagePath = urlImg;
    let file = null;
    try {
        file = req.file.filename;
    }catch (Error){
        console.log("not have file")
    }

    if (file) {
        imagePath = req.file ? `/public/images/ProductosNuevos/${req.file.filename}` : null;
        console.log("update imagen")
    }
    console.log("Ruta de la imagen:", imagePath);

    try {
        if (!name || !price || !stock || !category) {
            throw new Error('Todos los campos requeridos deben estar llenos.');
        }


        if (id) {
            // Actualizar producto existente
            await sql`
                UPDATE products
                SET name = ${name}, price = ${price}, stock = ${stock}, category = ${category}, image_url = ${imagePath},
                    description = ${description}, content = ${content}
                WHERE id = ${id}
            `;
            console.log("producto id update ", id)
            res.status(200).send('Producto actulizado exitosamente');
        } else if(!file){
            res.status(400).send('Ingresa una imagen');
        } else {
            if (!imagePath) {
                throw new Error('La imagen es obligatoria.');
            }
            // Crear nuevo producto
            await sql`
                INSERT INTO products (name, price, stock, category, active, image_url, description, content)
                VALUES (${name}, ${price}, ${stock}, ${category}, true, ${imagePath}, ${description}, ${content})
            `;
            console.log("product create")
            res.status(200).send('Producto guardado exitosamente');

        }

    } catch (error) {
        console.error('Error al guardar el producto:', error);
        res.status(500).send(`Error en el servidor: ${error.message}`);
    }
});

// Función para obtener productos
async function getProducts() {
    try {
        const products = await sql`
            SELECT id, name, price, stock, category, description, content, image_url
            FROM products
            WHERE active = true
        `;
        return products;
    } catch (error) {
        console.error('Error al obtener productos:', error);
        throw error;
    }
}


module.exports = router;
