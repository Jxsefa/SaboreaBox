const {neon} = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);

async function generatorPayment(userId) {
    try{
        let montoTotal = 0;
        let montoTotalMasComision = 0;

        const cart = await sql`SELECT c.product_id AS id_producto,
                                  p.price * c.quantity AS total, c.quantity AS cantidad
                           FROM carts  c JOIN products p ON c.product_id = p.id
                           WHERE c.user_id = ${userId}`;

        if (cart.length === 0) {
            return { success: false, message: "Carrito vacío" , "status": 400};
        }

        for(let i = 0; i < cart.length; i++){
            montoTotal = montoTotal + cart[i].total;
        }
        montoTotalMasComision = 2000 + montoTotal;
        const [user] = await sql`SELECT u.balance AS saldo FROM users u WHERE u.id = ${userId}`;
        console.log(user.saldo)

        if (!user || user.saldo < montoTotalMasComision) {
            return { success: false, message: "Saldo insuficiente", "status": 402 };
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
        return {success: true, message:"pago realizado correctamente", "status": 200};
        // Lógica adicional para realizar la compra...
    } catch (error) {
        console.log("error capturado en el catch:", error.message);
        return {success: false, message: "Error del servidor", "status": 500};
    }
}

function calcularNuevoBalance(balance, montoTotalMasComision) {

    const balanceNumerico = Number(balance);
    const montoNumerico = Number(montoTotalMasComision);

    return balanceNumerico - montoNumerico;
}

module.exports = {generatorPayment};

