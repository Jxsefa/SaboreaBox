const express = require('express');
const router = express.Router();
const verifyToken = require('../../middleware/verifyToken');
const {getShowProfile, getOrdersView, getUserOrders} = require("../services/walletService");

//@Swagger
/*
/user:
    get:
      summary: Obtener perfil del usuario
      description: Devuelve la información del perfil del usuario autenticado.
      responses:
        '200':
          description: Perfil del usuario obtenido exitosamente
          content:
            application/json:
              schema:
                type: object
                properties:
                  title:
                    type: string
                    example: "Perfil del Usuario"
                  profile:
                    type: object
                    properties:
                      id:
                        type: integer
                        example: 1
                      username:
                        type: string
                        example: "Maphs"
                      balance:
                        type: integer
                        example: 10000
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
          description: Error al obtener los datos
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

//@Swagger
/*
/order:
    get:
      summary: Obtener órdenes del usuario
      description: Devuelve la lista de órdenes realizadas por el usuario autenticado.
      responses:
        '200':
          description: Órdenes del usuario obtenidas exitosamente
          content:
            application/json:
              schema:
                type: object
                properties:
                  title:
                    type: string
                    example: "Órdenes del Usuario"
                  order_detail:
                    type: array
                    items:
                      type: object
                      properties:
                        order_id:
                          type: integer
                          example: 1
                        quantity:
                          type: integer
                          example: 2
                        price:
                          type: integer
                          example: 10000
                        product_name:
                          type: string
                          example: "Tiramisu Box"
                        order_date:
                          type: string
                          format: date
                          example: "15/10/2024"
                        total:
                          type: integer
                          example: 20000
        '500':
          description: Error al obtener las órdenes del usuario
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
                    example: "Error del servidor."
                  status:
                    type: integer
                    example: 500

 */
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
