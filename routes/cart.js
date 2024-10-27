const express = require('express');
const router = express.Router();
const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);
require('dotenv').config();

// Ruta para mostrar el carrito de compras
router.get('/', async (req, res) => {
    const userId = req.userId; // ID del usuario autenticado

    try {
        // Obtener los productos en el carrito del usuario desde la base de datos
        const cartItems = await sql`
            SELECT c.product_id, p.name, p.price, c.quantity
            FROM carts c
            JOIN products p ON c.product_id = p.id
            WHERE c.user_id = ${userId}
        `;

        // Renderizar la vista del carrito con el contenido del usuario autenticado
        res.render('cart', { cart: cartItems });
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).send('Error en el servidor.');
    }

});

router.post('/', async (req, res) => {
    const { productId } = req.body; // Obtener el ID del producto del cuerpo de la solicitud
    const userId = req.userId; // ID del usuario autenticado

    try {
        // Verificar si el producto ya está en el carrito del usuario
        const existingCartItem = await sql`
            SELECT * FROM carts WHERE user_id = ${userId} AND product_id = ${productId}
        `;

        if (existingCartItem.length > 0) {
            // Si el producto ya está en el carrito, incrementar la cantidad
            await sql`
                UPDATE carts SET quantity = quantity + 1 WHERE user_id = ${userId} AND product_id = ${productId}
            `;
        } else {
            // Si el producto no está en el carrito, agregarlo
            await sql`
                INSERT INTO carts (user_id, product_id, quantity) VALUES (${userId}, ${productId}, 1)
            `;
        }

        res.json({ message: 'Producto añadido al carrito.' });
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        res.status(500).json({ message: 'Error en el servidor.' });
    }
});

module.exports = router;