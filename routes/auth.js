const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { neon } = require('@neondatabase/serverless');

const router = express.Router(); // Definir el router
const sql = neon(process.env.DATABASE_URL);
const JWT_SECRET = process.env.JWT_SECRET || 'mi_secreto_super_seguro'; // Clave para JWT

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

        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Guardar el nuevo usuario en 'auth' y 'users'
        await sql`
            INSERT INTO auth (email, password, created_at)
            VALUES (${email}, ${hashedPassword}, NOW())
        `;
        await sql`
            INSERT INTO users (username, email, role, created_at)
            VALUES (${username}, ${email}, 'customer', NOW())
        `;

        // Crear el token JWT con el email del usuario
        const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });

        // Enviar el token como cookie
        res.cookie('token', token, { httpOnly: true, secure: false });
        return res.status(201).json({ message: 'Usuario registrado correctamente.' });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ message: 'Error en el servidor.' });
    }
});

// Login de usuario
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Verificar si el usuario existe en la tabla 'auth'
        const userAuth = await sql`SELECT * FROM auth WHERE email = ${email}`;

        if (userAuth.length === 0) {
            console.log('Correo no encontrado en la tabla auth.');
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }

        // Verificar la contraseña hasheada
        const validPassword = await bcrypt.compare(password, userAuth[0].password);
        if (!validPassword) {
            console.log('Contraseña incorrecta.');
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }

        // Crear el token JWT con el email del usuario
        const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });

        // Enviar el token como cookie
        res.cookie('token', token, { httpOnly: true, secure: false });

        // Pausa breve para permitir que la base de datos procese la inserción
        await sleep(500);

        // Obtener el rol del usuario usando el email en la tabla 'users'
        const user = await sql`SELECT * FROM users WHERE email = ${email}`;
        if (user.length === 0) {
            console.log('Usuario no encontrado en la tabla users.');
            return res.status(401).json({ message: 'Usuario no encontrado.' });
        }

        console.log(`Usuario autenticado con rol: ${user[0].role}`);

        // Enviar una respuesta JSON con la ruta de redirección
        if (user[0].role === 'admin') {
            return res.json({ redirectTo: '/admin' });
        } else {
            return res.json({ redirectTo: '/user' });
        }
    } catch (error) {
        console.error('Error en el inicio de sesión:', error);
        res.status(500).json({ message: 'Error en el servidor.' });
    }
});


module.exports = router;
