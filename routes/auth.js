// routes/auth.js
const express = require('express');
const router = express.Router();
const { neon } = require('@neondatabase/serverless');

// Inicializar la conexión a la base de datos
const sql = neon(process.env.DATABASE_URL);

// Ruta para registro de usuario
router.post('/register', async (req, res) => {
    console.log('Datos recibidos:', req.body); // Imprime los datos recibidos

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).send('Todos los campos son obligatorios.');
    }

    try {
        // Verificar si el email ya existe en la tabla auth
        const emailExists = await sql`SELECT * FROM auth WHERE email = ${email}`;

        if (emailExists.length > 0) {
            return res.status(400).send('El correo ya está registrado.');
        }

        // Verificar si el username ya existe en la tabla users
        const userExists = await sql`SELECT * FROM users WHERE username = ${username}`;

        if (userExists.length > 0) {
            return res.status(400).send('El nombre de usuario ya existe.');
        }

        // Insertar en la tabla users
        await sql`
            INSERT INTO users (username, role, created_at)
            VALUES (${username}, 'customer', NOW())
        `;

        // Insertar en la tabla auth
        await sql`
            INSERT INTO auth (email, password, created_at)
            VALUES (${email}, ${password}, NOW())
        `;

        res.status(201).send('Usuario registrado correctamente.');
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).send('Error en el servidor.');
    }
});

module.exports = router;
