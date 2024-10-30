const express = require('express');
const router = express.Router();
const {neon} = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);
require('dotenv').config();
const verifyToken = require('../../middleware/verifyToken');

router.post('/', verifyToken, async (req, res) => {
    const userId = req.userId;
    let montoTotal = 0;
    let montoTotalMasComision = 0;
    console.log("preueba payment")
    try{
        const cart = await sql`SELECT c.product_id AS id_producto,
                                  p.price * c.quantity AS total, c.quantity AS cantidad
                           FROM carts  c JOIN products p ON c.product_id = p.id
                           WHERE c.user_id = ${userId}`;
        console.log("consulta",cart.length)
        for(let i = 0; i < cart.length; i++){
            montoTotal = montoTotal + cart[i].total;
        }
        montoTotalMasComision = 2000 + montoTotal;
        const [user] = await sql`SELECT u.balance AS saldo FROM users u WHERE u.id = ${userId}`;
        console.log(user.saldo)
        if (user.saldo < montoTotalMasComision) {
            console.log("Saldo insuficiente, genera error");
            return res.status(400).json({ success: false, message: "Saldo insuficiente, genera error"})
        }

        const newBalance = calcularNuevoBalance(user.saldo, montoTotalMasComision);
        console.log("new balance: ", newBalance)
        await sql`UPDATE users SET balance = ${newBalance} WHERE id = ${userId}`;
        await sql`DELETE FROM carts WHERE user_id = ${userId}`;
        const [orderId] = await sql`INSERT INTO orders (user_id, amount_without_shipping, shipping_cost, created_at)
                                  VALUES (${userId},${montoTotal},2000, now())
                                      returning id`;

        console.log(orderId);
        for (const item of cart) {
            console.log(item)
            await sql`INSERT INTO order_details (order_id, product_id, quantity, price)
                VALUES (${orderId.id},${item.id_producto},${item.cantidad},${item.total} )`;
            console.log("item guardado")
        }
        console.log("fishigim")
        return res.status(200).json({success: true});
        // Lógica adicional para realizar la compra...
    } catch (error) {
        console.log("error capturado en el catch:", error.message);
        return res.status(400).json({ success: false, message: error.message });
    }




});

function calcularNuevoBalance(balance, montoTotalMasComision) {
    // Limpiar el balance y el monto para que contengan solo números y puntos decimales


    // Convertir a números

    const balanceNumerico = Number(balance);
    const montoNumerico = Number(montoTotalMasComision);


    // Calcular el nuevo balance
    return balanceNumerico - montoNumerico;
}

module.exports = router;