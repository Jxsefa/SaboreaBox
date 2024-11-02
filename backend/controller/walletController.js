const express = require('express');
const router = express.Router();
const verifyToken = require('../../middleware/verifyToken');
const {getShowProfile, getOrdersView, getUserOrders} = require("../services/walletService");

//@Swagger
/*
/ViewProfile:
    get:
      summary: Muestra el perfil del usuario
      description: Muestra los datos del usuario (Wallet) usando el ID del usuario
      responses:
        '404':
          description: Usuario no encontrado
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: false
                  message:
                    type: string
                    example: "Usuario no encontrado"
                  status:
                    type: integer
                    example: 404
        '500':
          description: Error del servidor
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: false
                  message:
                    type: string
                    example: "Error en el servidor"
                  status:
                    type: integer
                    example: 500

 */

// Ruta para mostrar el perfil del usuario (wallet)
router.get('/',verifyToken, async (req, res) => {

    const userId = req.userId;
    console.log("ViewProfile",req.body);
    const result = await getShowProfile(userId);
    if (!result.success) {
        return res.status(result.status).json(result);
    }

    res.json({
        title: 'Perfil del Usuario',
        profile: result.profile
    });

});

//Ruta para mostrar las ordenes del usuario
router.get('/order', verifyToken, async (req, res) => {
    const userId = req.userId;
    console.log("ViewOrders",req.body);
    const result = await getUserOrders(userId);

    if (!result.success) {
        return res.status(result.status).json(result);
    }

    res.json({
        title: 'Ordenes del Usuario',
        order_detail: result.orders
    });
});


module.exports = router;
