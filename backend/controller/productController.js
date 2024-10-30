const express = require('express');
const router = express.Router();
const { getProductById, getProducts, deleteProductById, activeProductById, saveOrUpdateProduct } = require('../services/productosService');
const upload = require('../utils/saveImage')

/**
 * @swagger
 * /products:
 *   delete:
 *     summary: Elimina un producto estableciendo active=false
 *     tags: [Productos]
 *     requestBody:
 *       description: ID del producto a eliminar
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: integer
 *                 description: ID del producto a eliminar
 *                 example: 1
 *     responses:
 *       200:
 *         description: Producto eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Producto eliminado exitosamente."
 *       500:
 *         description: Error al eliminar el producto
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error al eliminar el producto."
 */

router.delete('/', async (req, res) => {
    const {productId} = req.body;
    const parsedProductId = parseInt(productId);
    res.json( await deleteProductById(parsedProductId));
})

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Obtiene todos los productos activos
 *     tags: [Productos]
 *     responses:
 *       200:
 *         description: Lista de productos activos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: "Producto A"
 *                   price:
 *                     type: number
 *                     example: 10000
 *                   stock:
 *                     type: integer
 *                     example: 50
 *                   category:
 *                     type: string
 *                     example: "Categoría A"
 *                   description:
 *                     type: string
 *                     example: "Descripción del producto A"
 *                   content:
 *                     type: string
 *                     example: "Contenido del producto A"
 *                   image_url:
 *                     type: string
 *                     example: "/public/images/productoA.jpg"
 */

router.get('/', async (req, res) => {
        let products = await getProducts();
        res.json(products);
});


router.get("/view", async (req, res) => {

    let products = await getProducts();

    res.render('products', {title: 'Catálogo de Productos', products});
})

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Obtiene un producto específico por ID
 *     tags: [Productos]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto a obtener
 *     responses:
 *       200:
 *         description: Producto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: "Producto A"
 *                 price:
 *                   type: number
 *                   example: 10000
 *                 stock:
 *                   type: integer
 *                   example: 50
 *                 category:
 *                   type: string
 *                   example: "Categoría A"
 *                 description:
 *                   type: string
 *                   example: "Descripción del producto A"
 *                 content:
 *                   type: string
 *                   example: "Contenido del producto A"
 *                 image_url:
 *                   type: string
 *                   example: "/public/images/productoA.jpg"
 *       404:
 *         description: Producto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "product not found"
 */

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    console.log("ID recibido:", id);
        let product = await getProductById(id)
        res.json(product);
});

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Activa un producto estableciendo active=true
 *     tags: [Productos]
 *     requestBody:
 *       description: ID del producto a activar
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: integer
 *                 description: ID del producto a activar
 *                 example: 1
 *     responses:
 *       200:
 *         description: Producto activado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Producto activado exitosamente."
 *       500:
 *         description: Error al activar el producto
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error al activar el producto."
 */

router.post("/", async (req, res) => {
    const {productId} = req.body;
    const parsedProductId = parseInt(productId);

    res.json(await activeProductById(parsedProductId));
});

/**
 * @swagger
 * /products/save:
 *   post:
 *     summary: Guarda o actualiza un producto
 *     tags: [Productos]
 *     requestBody:
 *       description: Información del producto a guardar o actualizar, incluyendo una imagen opcional
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID del producto (para actualización, opcional)
 *                 example: 1
 *               name:
 *                 type: string
 *                 description: Nombre del producto
 *                 example: "Producto A"
 *               price:
 *                 type: number
 *                 description: Precio del producto
 *                 example: 10000
 *               stock:
 *                 type: integer
 *                 description: Stock disponible del producto
 *                 example: 50
 *               category:
 *                 type: string
 *                 description: Categoría del producto
 *                 example: "Categoría A"
 *               description:
 *                 type: string
 *                 description: Descripción del producto
 *                 example: "Descripción del producto A"
 *               content:
 *                 type: string
 *                 description: Contenido del producto
 *                 example: "Contenido del producto A"
 *               imagen:
 *                 type: string
 *                 format: binary
 *                 description: Imagen del producto
 *     responses:
 *       200:
 *         description: Producto guardado o actualizado exitosamente
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Producto guardado exitosamente"
 *       400:
 *         description: Error en los datos del producto o imagen faltante
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Ingresa una imagen"
 *       500:
 *         description: Error en el servidor al guardar o actualizar el producto
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Error en el servidor: <mensaje de error>"
 */

router.post('/save', upload.single('imagen'), async (req, res) => {
    const { id, name, price, stock, category, description, content, urlImg } = req.body;
    let imagePath = urlImg;
    console.log(id, name, price, stock, category, description, content, urlImg)
    // Verificar si se subió un archivo
    const file = req.file ? req.file.filename : null;
    if (file) {
        imagePath = `/public/images/ProductosNuevos/${file}`;
    } else if (!id) {
        return res.status(400).send('Ingresa una imagen');
    }

    try {
        const message = await saveOrUpdateProduct({ id, name, price, stock, category, description, content }, imagePath);
        res.status(200).send(message);
    } catch (error) {
        console.error('Error al guardar el producto:', error);
        res.status(500).send(`Error en el servidor: ${error.message}`);
    }
});

module.exports = router;
