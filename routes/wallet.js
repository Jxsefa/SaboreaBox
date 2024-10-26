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
        if (!user) {
            console.log(userId)
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.render('user', {
            title: 'Perfil de Usuario',
            username: user.username,
            balance: user.balance,
        }); // Renderiza la vista del perfil del usuario
    } catch (error) {
        console.error('Error al obtener el perfil del usuario:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

module.exports = router;
