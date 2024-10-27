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
            INSERT INTO users (username, email, role, created_at, balance)
            VALUES (${username}, ${email}, 'customer', NOW(), 15000)
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


router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Verificar si el usuario existe en la tabla 'auth'
        const userAuth = await getAuth(email);

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

        // Pausa breve para permitir que la base de datos procese la inserción


        // Obtener el rol del usuario usando el email en la tabla 'users'
        const user = await sql`SELECT * FROM users WHERE email = ${email}`;
        if (user.length === 0) {
            console.log('Usuario no encontrado en la tabla users.');
            return res.status(401).json({ message: 'Usuario no encontrado.' });
        }
        // Crear el token JWT con el email del usuario
        const token = jwt.sign({ userId: user[0].id, email, role: user[0].role }, JWT_SECRET, { expiresIn: '1h' });

        console.log(token);

        // Enviar el token como cookie
        res.cookie('token', token, { httpOnly: true, secure: false });
        res.cookie('userName', user[0].username, { httpOnly: true, secure: false });
        console.log(`Usuario autenticado con rol: ${user[0].role}`);

        // Enviar una respuesta JSON con la ruta de redirección
        if (user[0].role === 'admin') {
            const redirectTo = '/admin';
            return res.json({ redirectTo });// Redirige al panel de admin
        } else {
            console.log(user)
            const redirectTo = '/user';
            return res.json({ redirectTo }); // Redirige al perfil de usuario
        }
    } catch (error) {
        console.error('Error en el inicio de sesión:', error);
        res.status(500).json({ message: 'Error en el servidor.' });
    }
});

async function getAuth(email) {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await sql`SELECT * FROM auth WHERE email = ${email}`;
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}

router.get('/logout', (req, res) => {
    // Eliminar las cookies de autenticación
    res.clearCookie('token');
    res.clearCookie('userName');
    console.log("cerrando sesión")
    // Redirigir al usuario a la página de inicio de sesión
    res.redirect('/');
});

module.exports = router;
