const express = require('express');
const router = express.Router();
const { getProductById, getProducts, deleteProductById, activeProductById, saveOrUpdateProduct } = require('../services/productosService');
const upload = require('../utils/saveImage')

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
