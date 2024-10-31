//cartService.js
const {neon} = require('@neondatabase/serverless');
const router = require("../controller/auth");

const sql = neon(process.env.DATABASE_URL);

//--getViewCart
async function getViewCart(userId) {
    try {
        // Obtener los productos en el carrito del usuario desde la base de datos
        const cartItems = await sql`
            SELECT c.product_id , p.name, p.price, c.quantity, p.image_url
            FROM carts c
            JOIN products p ON c.product_id = p.id
            WHERE c.user_id = ${userId}
        `;

        // Renderizar la vista del carrito con el contenido del usuario autenticado
        res.render('cart', {cart: cartItems}); //-- duda
    } catch (error) {
        console.log("Error al obtener el carrito:", error.message);
        return {success: false,
            message: "Error del servidor",
            "status": 500
        };
    }
}

//--getAddToCart
async function getAddToCart(userId) {
    if (!userId) {
        return {success: false,
            message: "Debes iniciar sesión para agregar productos al carrito.",
            "status": 401
        };

    }

    try {
        await sql`
            INSERT INTO carts (user_id, product_id, quantity)
            VALUES (${userId}, ${productId}, ${quantity}) ON CONFLICT (user_id, product_id)
            DO
            UPDATE SET quantity = carts.quantity + ${quantity}
        `;

        res.json({success: true,
            message: 'Producto agregado al carrito.'});
    } catch (error) {
        console.log("Error al agregar producto al carrito:", error.message);
        return {success: false,
            message: "Error al agregar producto al carrito.",
            "status": 500
        };
    }
}

//--getDeleteToCart
async function getRemoveFromCart(userId) {
    if (!userId) {
        return {success: false,
            message: "Debes iniciar sesión para eliminar productos del carrito.",
            "status": 401
        };
    }

    try {
        await sql`
            DELETE FROM carts
            WHERE user_id = ${userId} AND product_id = ${productId}
        `;
        return {success: true,
            message: "Producto eliminado del carrito.",
            "status": 200
        };
    } catch (error) {
        console.log("Error al eliminar producto del carrito:", error.message);
        return {success: false,
            message: "Error en el servidor.",
            "status": 500
        };
    }
}

module.exports = { getViewCart, getAddToCart, getRemoveFromCart };