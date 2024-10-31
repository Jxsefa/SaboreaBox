//walletService.js
const {neon} = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

//--getShowProfile
async function getShowProfile(userId) {
    try {
        const [user] = await sql`SELECT id, username, role, balance 
                                    FROM users 
                                    WHERE id = ${userId}`;

        if (!user) {
            console.log(userId)
            return {success: false,
                message: "Usuario no encontrado",
                "status": 404
            };
        }

        return {
            success: true,
            profile: {
                id: user.id,
                username: user.username,
                balance: user.balance
            }
        };

    } catch (error) {
        console.log("Error al obtener el perfil del usuario:", error.message);
        return {success: false,
            message: "Error del servidor",
            "status": 500
        };
    }
}

//-- getOrdersView
async function getUserOrders(userId) {
    try{
        const order_detail = await sql`SELECT  o.id AS order_id, od.quantity, od.price, p.name AS product_name, TO_CHAR(o.created_at,'DD/MM/YYYY')  AS order_date, od.quantity * od.price AS total
                                       FROM order_details od
                                        JOIN orders o ON od.order_id = o.id
                                        JOIN products p ON od.product_id = p.id
                                       WHERE o.user_id = ${userId}
                                       ORDER BY o.created_at DESC`;
        return {
            success: true,
            orders: order_detail
        };

    } catch (error) {
        console.log("Error al obtener ordenes del usuario:", error.message);
        return {success: false,
            message: "Error del servidor",
            "status": 500
        };
    }
}


module.exports = { getShowProfile, getUserOrders };