const express = require('express');
const router = express.Router();
const {neon} = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

router.delete('/', async (req, res) => {
    const {productId} = req.body;
    const parsedProductId = parseInt(productId);

    try {
        await sql`update products
                  set active = false
                  where id = ${parsedProductId};`;
        res.json({ message: 'Producto eliminado exitosamente.' });
    } catch (error) {
        res.json({ message: 'Error al guardar el producto.' });
    }
})


router.get('/', async (req, res) => {
    try {
        // Obtener todos los productos activos
        const products = await sql`SELECT id,
                                          name,
                                          price,
                                          stock,
                                          category,
                                          description,
                                          content,
                                          image_url
                                   FROM products
                                   WHERE active = true`;

        // Renderizar la vista 'products' pasando los productos
        res.render('products', {title: 'Catálogo de Productos', products});
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).send('Error en el servidor.');
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    console.log("ID recibido:", id);

    try {
        const [product] = await sql`SELECT id,
                                          name,
                                          price,
                                          stock,
                                          category,
                                          description,
                                          content,
                                          image_url
                                   FROM products
                                   WHERE active = true
                                   and id = ${id}
                                   `;
        console.log(product);
        res.json(product);
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        res.status(500).send('Error en el servidor');
    }
});

module.exports = router;
