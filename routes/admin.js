const express = require('express');
const router = express.Router();
const { neon } = require('@neondatabase/serverless');

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

// Ruta para agregar o actualizar productos
router.post('/save', async (req, res) => {
    const { id, name, price, stock, category } = req.body;

    try {
        if (!name || !price || !stock || !category) {
            throw new Error('Todos los campos requeridos deben estar llenos.');
        }

        if (id) {
            // Actualizar producto existente
            await sql`
                UPDATE products
                SET name = ${name}, price = ${price}, stock = ${stock}, category = ${category}
                WHERE id = ${id}
            `;
        } else {
            // Crear nuevo producto
            await sql`
                INSERT INTO products (name, price, stock, category, active)
                VALUES (${name}, ${price}, ${stock}, ${category}, true)
            `;
        }

        res.status(200).send('Producto guardado exitosamente');
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
