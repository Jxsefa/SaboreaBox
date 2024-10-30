const express = require('express');
const router = express.Router();
const {neon} = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);
require('dotenv').config();
const verifyToken = require('../../middleware/verifyToken');

// Ruta para mostrar el carrito de compras
router.get('/', verifyToken, async (req, res) => {
    const userId = req.userId; // ID del usuario autenticado

    try {
        // Obtener los productos en el carrito del usuario desde la base de datos
        const cartItems = await sql`
            SELECT c.product_id , p.name, p.price, c.quantity, p.image_url
            FROM carts c
            JOIN products p ON c.product_id = p.id
            WHERE c.user_id = ${userId}
        `;

        // Renderizar la vista del carrito con el contenido del usuario autenticado
        res.render('cart', {cart: cartItems});
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).send('Error en el servidor.');
    }

});

// Ruta para agregar producto al carrito
router.post('/', verifyToken, async (req, res) => {
    const {productId, quantity} = req.body;
    const userId = req.userId;
    console.log("id", userId);
    // Verifica si el usuario está autenticado (opcional)
    if (!userId) {
        return res.status(401).json({
            success: false,
            message: 'Debes iniciar sesión para agregar productos al carrito.'
        });
    }

    try {
        console.log("aers ", userId, productId, quantity);
        await sql`
            INSERT INTO carts (user_id, product_id, quantity)
            VALUES (${userId}, ${productId}, ${quantity}) ON CONFLICT (user_id, product_id)
            DO
            UPDATE SET quantity = carts.quantity + ${quantity}
        `;

        res.json({success: true, message: 'Producto agregado al carrito.'});
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        res.status(500).json({success: false, message: 'Error al agregar producto al carrito.'});
    }
});
// Ruta para eliminar un producto del carrito
router.delete('/', verifyToken, async (req, res) => {
    const { productId } = req.body;
    const userId = req.userId;
    console.log("Producto id", productId);
    if (!userId) {
        return res.status(401).json({ success: false, message: 'Debes iniciar sesión para eliminar productos del carrito.' });
    }

    try {
        await sql`
            DELETE FROM carts
            WHERE user_id = ${userId} AND product_id = ${productId}
        `;
        return res.status(200).json({ success: true, message: 'Producto eliminado del carrito.' });
    } catch (error) {
        console.error('Error al eliminar producto del carrito:', error);
        return res.status(500).json({ success: false, message: 'Error en el servidor.' });
    }
});


module.exports = router;