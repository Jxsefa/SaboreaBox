const express = require('express');
const router = express.Router();
require('dotenv').config();
const verifyToken = require('../../middleware/verifyToken');
const {getViewCart, getAddToCart, getRemoveFromCart} = require("../services/cartService");

//@Swagger
/*
/ViewCart:
    get:
      summary: Muestra el contenido del carrito
      description: Despliega los productos que llenan el carrito gracias al ID del usuario
      responses:
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
// Ruta para mostrar el carrito de compras
router.get('/', verifyToken, async (req, res) => {
    const userId = req.userId; // ID del usuario autenticado
    console.log("ViewCart", userId);
    const result = await getViewCart(userId);

    if (!result.success) {
        return res.status(result.status).json(result);
    }
    res.json(result);
});

//@Swagger
/*
/Add:
    post:
      summary: Agrega contenido al carrito
      description: Agrega el contenido al carrito verificando si está logueado el usuario
      responses:
        '401':
          description: Se debe loguear el usuario para agregar al carrito
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
                    example: "Debes iniciar sesión para agregar productos al carrito."
                  status:
                    type: integer
                    example: 401
 */
// Ruta para agregar producto al carrito

router.post('/', verifyToken, async (req, res) => {
    console.log("Add",req.body);
    const userId = req.userId;
    const { productId, quantity } = req.body;

    console.log("id", userId);
    const result = await getAddToCart(userId, productId, quantity);

    if (!result.success) {
        return res.status(result.status || 500).json(result);
    }

    res.json(result);
});

//@Swagger
/*
/Remove:
    delete:
      summary: Remueve contenido al carrito
      description: Remueve el contenido al carrito verificando si está logueado el usuario
      responses:
        '401':
          description: Se debe loguear el usuario para remover contenido del carrito
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
                    example: "Debes iniciar sesión para eliminar productos del carrito."
                  status:
                    type: integer
                    example: 401
        '200':
          description: Se elimina correctamente un producto del usuario
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  message:
                    type: string
                    example: "Producto eliminado del carrito."
                  status:
                    type: integer
                    example: 200
        '500':
          description: Error al eliminar un producto del carrito
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
// Ruta para eliminar un producto del carrito
//ta weno
router.delete('/', verifyToken, async (req, res) => {
    console.log("Remove",req.body);
    const userId = req.userId;
    const result = await getRemoveFromCart(userId);
    res.json(result);
});


module.exports = router;



/*
*
* Tienes que probar los enpoints antes de decir que estan listo eso, ya que no carga el aplicativo cuando se reliza
* el node app.js
*
* */