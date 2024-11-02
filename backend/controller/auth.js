const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {loginService} = require('../services/loginService');
const {registerService} = require('../services/registerService');

const router = express.Router(); // Definir el router

// Registro de usuario
/**
 * @swagger
 * /register:
 *   post:
 *     summary: Registro de un nuevo usuario
 *     tags: [Autenticación]
 *     requestBody:
 *       description: Información necesaria para registrar un nuevo usuario
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Nombre de usuario
 *                 example: "usuario123"
 *               email:
 *                 type: string
 *                 description: Correo electrónico del usuario
 *                 example: "usuario@example.com"
 *               password:
 *                 type: string
 *                 description: Contraseña segura
 *                 example: "passwordSeguro123"
 *     responses:
 *       200:
 *         description: Usuario registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuario registrado correctamente."
 *                 status:
 *                   type: integer
 *                   example: 200
 *       400:
 *         description: Todos los campos son obligatorios
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Todos los campos son obligatorios."
 *                 status:
 *                   type: integer
 *                   example: 400
 *       409:
 *         description: El usuario o correo ya existe
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "El usuario o correo ya existe."
 *                 status:
 *                   type: integer
 *                   example: 409
 *       500:
 *         description: Error en el servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error en el servidor."
 *                 status:
 *                   type: integer
 *                   example: 500
 */

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    const result = await registerService(username, email, password);

    if(result.status >= 400) {
        return res.status(result.status).json({result})
    }
    res.json(result);

});

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Inicio de sesión de un usuario
 *     tags: [Autenticación]
 *     requestBody:
 *       description: Credenciales de inicio de sesión
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "usuario@example.com"
 *               password:
 *                 type: string
 *                 example: "passwordSeguro123"
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso, devuelve un token JWT
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "login realizado correctamente."
 *                 status:
 *                   type: integer
 *                   example: 200
 *       400:
 *         description: Credenciales inválidas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Credenciales inválidas"
 *                 status:
 *                   type: integer
 *                   example: 400
 *       500:
 *         description: Error en el servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error en el servidor"
 *                 status:
 *                   type: integer
 *                   example: 500
 */

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const result = await loginService(email, password, res);

    if (result.status >= 400) {
        return res.status(result.status).json(result);
    }
    res.status(200).json(result);
});



router.get('/logout', (req, res) => {
    // Eliminar las cookies de autenticación
    res.clearCookie('token');
    res.clearCookie('userName');
    console.log("cerrando sesión")
    // Redirigir al usuario a la página de inicio de sesión
    res.redirect('/');
});

module.exports = router;
