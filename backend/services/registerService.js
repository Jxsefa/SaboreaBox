const bcrypt = require("bcrypt");
const {neon} = require("@neondatabase/serverless");
const sql = neon(process.env.DATABASE_URL);

async function registerService(username, email, password, res) {
    if (!username || !email || !password) {
        return {message: 'Todos los campos son obligatorios.'};
    }

    try {
        // Verificar si el usuario ya existe en 'users' o 'auth'
        const usernameExists = await sql`SELECT * FROM users WHERE username = ${username}`;
        const emailExists = await sql`SELECT * FROM auth WHERE email = ${email}`;

        if (usernameExists.length > 0 || emailExists.length > 0) {
            return { message: 'El usuario o correo ya existe.', "status":409 };
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

        // Enviar el token como cookie
        return { message: 'Usuario registrado correctamente.', "status": 200};
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        return { message: 'Error en el servidor.', "status": 500  };
    }
}
module.exports = {registerService};