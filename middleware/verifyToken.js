const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'mi_secreto_super_seguro';

// Middleware para validar JWT a través de cookies
function verifyToken(req, res, next) {
    const token = req.cookies.token; // Obtiene el token de la cookie 'token'
    console.log(token)
    console.log("estoy verificando")
    if (!token) {
        return res.status(401).json({ success: false, message: 'Usuario no autorizado' });
    }

    try {
        // Verificar y decodificar el token
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log("decode ", decoded);
        let userId = decoded.userId;
        if(!userId) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }
        console.log(userId);
        req.userId = decoded.userId; // Agrega el ID del usuario a la solicitud
        next();
    } catch (error) {
        console.log("token borrado")
        res.clearCookie('token', { httpOnly: true, secure: false });
        console.error('Error al verificar el token:', error);
        return res.status(403).json({ success: false, message: 'Usuario no autorizado' });
    }
}

module.exports = verifyToken;
