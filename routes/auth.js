const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const { neon } = require('@neondatabase/serverless');

// Inicializar la conexión a la base de datos
const sql = neon(process.env.DATABASE_URL);

// Registro de usuario
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    try {
        // Verificar si el usuario ya existe en 'users' o 'auth'
        const usernameExists = await sql`SELECT * FROM users WHERE username = ${username}`;
        const emailExists = await sql`SELECT * FROM auth WHERE email = ${email}`;

        if (usernameExists.length > 0 || emailExists.length > 0) {
            return res.status(400).json({ message: 'El usuario o correo ya existe.' });
        }

        // Hashear la contraseña antes de guardar
        const hashedPassword = await bcrypt.hash(password, 10);  // Aquí es donde se hace el hash

        // Guardar el nuevo usuario en 'auth' y 'users'
        await sql`
            INSERT INTO auth (email, password, created_at)
            VALUES (${email}, ${hashedPassword}, NOW())
        `;
        await sql`
            INSERT INTO users (username, role, created_at)
            VALUES (${username}, 'customer', NOW())
        `;

        // Enviar respuesta JSON de éxito
        res.status(201).json({ message: 'Usuario registrado correctamente.' });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ message: 'Error en el servidor.' });
    }
});

// Login de usuario
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    try {
        // Buscar el usuario por el email en la tabla 'auth'
        const user = await sql`SELECT * FROM auth WHERE email = ${email}`;
        if (user.length === 0) {
            return res.status(400).json({ message: 'Correo o contraseña incorrectos.' });
        }

        // Comparar la contraseña
        const passwordMatch = await bcrypt.compare(password, user[0].password);
        if (!passwordMatch) {
            return res.status(400).json({ message: 'Correo o contraseña incorrectos.' });
        }

        // Enviar respuesta JSON de éxito y crear una cookie de sesión
        res.cookie('user_id', user[0].id, { httpOnly: true });
        res.status(200).json({ message: 'Inicio de sesión exitoso.' });
    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({ message: 'Error en el servidor.' });
    }
});

module.exports = router;
