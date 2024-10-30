const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {loginService} = require('../services/loginService');
const {registerService} = require('../services/registerService');

const router = express.Router(); // Definir el router

// Registro de usuario
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    const result = await registerService(username, email, password);

    if(result.status >= 400) {
        return res.status(result.status).json({result})
    }
    res.json(result);

});

// Login de usuario


router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const result = await loginService(email, password, res);

    if(result.status >= 400) {
        return res.status(result.status).json({result})
    }
    res.json(result);
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
