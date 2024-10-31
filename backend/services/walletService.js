//walletService.js
const {neon} = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

//--getShowProfile

async function getShowProfile(userId) {
    try {
        const [user] = await sql`SELECT id, username, role, balance FROM users WHERE id = ${userId}`;
        const order_detail = await sql`SELECT  o.id AS order_id, od.quantity, od.price, p.name AS product_name, TO_CHAR(o.created_at,'DD/MM/YYYY')  AS order_date, od.quantity * od.price AS total
                                       FROM order_details od
                                        JOIN orders o ON od.order_id = o.id
                                        JOIN products p ON od.product_id = p.id
                                       WHERE o.user_id = ${userId}
                                       ORDER BY o.created_at DESC`;
        if (!user) {
            console.log(userId)
            return {success: false,
                message: "Usuario no encontrado",
                "status": 404
            };
        }
        console.log(order_detail);
        res.render('user', {
            title: 'Perfil de Usuario',
            username: user.username,
            balance: user.balance,
            order_detail
        }); // Renderiza la vista del perfil del usuario
    } catch (error) {
        console.log("Error al obtener el perfil del usuario:", error.message);
        return {success: false,
            message: "Error del servidor",
            "status": 500
        };
    }
}

module.exports = { getShowProfile };