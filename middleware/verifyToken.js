const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'mi_secreto_super_seguro';

// Middleware para validar JWT a través de cookies
function verifyToken(req, res, next) {
    const token = req.cookies.token; // Obtiene el token de la cookie 'token'
    console.log(token)
    console.log("estoy verificando")
    if (!token) {
        res.clearCookie('token', { httpOnly: true, secure: false });
        return res.redirect('/login');
    }

    try {
        // Verificar y decodificar el token
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log("decode ", decoded);
        let userId = decoded.userId;
        if(!userId) {
            throw new Error('Usuario no encontrado en la tabla users.');
        }
        console.log(userId);
        req.userId = decoded.userId; // Agrega el ID del usuario a la solicitud
        next();
    } catch (error) {
        console.log("token borrado")
        res.clearCookie('token', { httpOnly: true, secure: false });
        console.error('Error al verificar el token:', error);
        return res.redirect('/login');
    }
}

module.exports = verifyToken;
