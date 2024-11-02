//adminService.js
const {neon} = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

async function getSold() {
    try{
        const productosVendidosResult = await sql`
            SELECT SUM(od.quantity) AS total
            FROM order_details od
            JOIN orders o ON od.order_id = o.id
            WHERE EXTRACT(MONTH FROM o.created_at) = EXTRACT(MONTH FROM CURRENT_DATE)
        `;
        const productosVendidos = productosVendidosResult[0]?.total || 0;
        return {productosVendidos, "status": 200};
    }
    catch (error) {
        return {"message": error.message, "status": 500 };
    }

}

async function getUserActive() {
    try {
        const usuariosActivosResult = await sql`
            SELECT COUNT(DISTINCT user_id) AS total
            FROM orders
            WHERE EXTRACT(MONTH FROM created_at) = EXTRACT(MONTH FROM CURRENT_DATE)
        `;
        const usuariosActivos = usuariosActivosResult[0]?.total || 0;
        return {usuariosActivos, "status": 200};
    }
    catch (error) {
        return {"message": error.message, "status": 500 };
    }

}

async function getSale() {
    try {
        const totalVentasResult = await sql`
            SELECT SUM(total_amount) AS total
            FROM orders
            WHERE EXTRACT(MONTH FROM created_at) = EXTRACT(MONTH FROM CURRENT_DATE)
        `;
        const totalVentas = totalVentasResult[0]?.total || 0;
        return {totalVentas, "status": 200};
    } catch (error) {
        console.log("Error al obtener datos del Dashboard:", error.message);
        return {success: false, message: "Error en el servidor", "status": 500 };
    }
}

module.exports = { getSale, getSold, getUserActive };