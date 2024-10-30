const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {neon} = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);
const JWT_SECRET = process.env.JWT_SECRET || 'mi_secreto_super_seguro'; // Clave para JWT

async function loginService( email, password, res) {

    try {
        // Verificar si el usuario existe en la tabla 'auth'
        const userAuth = await getAuth(email);

        if (userAuth.length === 0) {
            console.log('Correo no encontrado en la tabla auth.');
            return {message: 'Credenciales inválidas.'};
        }

        // Verificar la contraseña hasheada
        const validPassword = await bcrypt.compare(password, userAuth[0].password);
        if (!validPassword) {
            console.log('Contraseña incorrecta.');
            return {message: 'Credenciales inválidas.', "status": 400};
        }

        // Pausa breve para permitir que la base de datos procese la inserción


        // Obtener el rol del usuario usando el email en la tabla 'users'
        const user = await sql`SELECT * FROM users WHERE email = ${email}`;
        if (user.length === 0) {
            console.log('Usuario no encontrado en la tabla users.');
            return { message: 'Usuario no encontrado.', "status": 404 };
        }
        // Crear el token JWT con el email del usuario
        const token = jwt.sign({ userId: user[0].id, email, role: user[0].role }, JWT_SECRET, { expiresIn: '1h' });

        console.log(token);

        // Enviar el token como cookie
        res.cookie('token', token, { httpOnly: true, secure: false });
        res.cookie('userName', user[0].username, { httpOnly: true, secure: false });
        console.log(`Usuario autenticado con rol: ${user[0].role}`);
        return { message: 'login realizado correctamente.', "status": 200 };

    } catch (error) {
        console.error('Error en el inicio de sesión:', error);
        return { message: 'Error en el servidor.', "status": 500 };
    }
}
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

module.exports = {loginService};