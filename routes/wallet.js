const express = require('express');
const router = express.Router();
const { neon } = require('@neondatabase/serverless');
const verifyToken = require('../middleware/verifyToken');

// Conectar a la base de datos Neon
const sql = neon(process.env.DATABASE_URL);

// Ruta para mostrar el perfil del usuario (wallet)
router.get('/',verifyToken, async (req, res) => {
    const userId = req.userId; // Supongamos que obtienes el userId del middleware de autenticación
    try {
        const [user] = await sql`SELECT id, username, role, balance FROM users WHERE id = ${userId}`;
        const order_detail = await sql`SELECT  o.id AS order_id, od.quantity, od.price, p.name AS product_name, TO_CHAR(o.created_at,'DD/MM/YYYY')  AS order_date, od.quantity * od.price AS total
                                       FROM order_details od
                                        JOIN orders o ON od.order_id = o.id
                                        JOIN products p ON od.product_id = p.id
                                       WHERE o.user_id = ${userId}
                                       ORDER BY o.created_at DESC`;
        if (!user) {
            console.log(userId)
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        console.log(order_detail);
        res.render('user', {
            title: 'Perfil de Usuario',
            username: user.username,
            balance: user.balance,
            order_detail
        }); // Renderiza la vista del perfil del usuario
    } catch (error) {
        console.error('Error al obtener el perfil del usuario:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});


module.exports = router;
