const express = require('express');
const router = express.Router();
const { getProductById, getProducts, deleteProductById, activeProductById } = require('../services/productosService');


router.delete('/', async (req, res) => {
    const {productId} = req.body;
    const parsedProductId = parseInt(productId);
    res.json( await deleteProductById(parsedProductId));
})

router.get('/', async (req, res) => {
        let products = await getProducts();
        res.json(products);
});

router.get("/view", async (req, res) => {

    let products = await getProducts();

    res.render('products', {title: 'Catálogo de Productos', products});
})

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    console.log("ID recibido:", id);
        let product = await getProductById(id)
        res.json(product);
});

router.post("/", async (req, res) => {
    const {productId} = req.body;
    const parsedProductId = parseInt(productId);

    res.json(await activeProductById(parsedProductId));
});

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

module.exports = router;
