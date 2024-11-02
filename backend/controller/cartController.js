const express = require('express');
const router = express.Router();
require('dotenv').config();
const verifyToken = require('../../middleware/verifyToken');
const {getViewCart, getAddToCart, getRemoveFromCart} = require("../services/cartService");

//@Swagger
/*
/cart:
    get:
      summary: Muestra el contenido del carrito
      description: Despliega los productos que llenan el carrito gracias al ID del usuario
      security:
      - bearerAuth: []
      responses:
        '200':
          description: Carrito obtenido exitosamente
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  cart:
                    type: array
                    items:
                      type: object
                      properties:
                        product_id:
                          type: integer
                          example: 1
                        name:
                          type: string
                          example: "Tiramisu Box"
                        price:
                          type: integer
                          example: 10000
                        quantity:
                          type: integer
                          example: 1
                        image_url:
                          type: string
                          example: "/public/images/tiramisu1.jpg"
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
/cart/save:
    post:
      summary: Agrega contenido al carrito
      description: Agrega el contenido al carrito verificando si está logueado el usuario
      security:
      - bearerAuth: []
      requestBody:
        required: true
        content:
            application/json:
              schema:
                type: object
                properties:
                  productId:
                    type: integer
                    example: 1
                  quantity:
                    type: integer
                    example: 2
      responses:
        '200':
          description: Producto agregado al carrito exitosamente
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
                    example: "Producto agregado al carrito."
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
        '500':
          description: Error al agregar el producto al carrito
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
                    example: "Error al agregar producto al carrito."
                  status:
                    type: integer
                    example: 500
 */
// Ruta para agregar producto al carrito

router.post('/save', verifyToken, async (req, res) => {
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
/cart/remove:
    delete:
      summary: Remueve contenido al carrito
      description: Remueve el contenido al carrito verificando si está logueado el usuario
      responses:
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
        '400':
          description: Solicitud incorrecta, ID de producto requerido
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
                    example: "Se requiere ID del producto."
                  status:
                    type: integer
                    example: 400
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
        '404':
          description: Producto no encontrado en el carrito
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
                    example: "El producto no está en el carrito."
                  status:
                    type: integer
                    example: 404
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
router.delete('/remove', verifyToken, async (req, res) => {
    console.log("Remove",req.body);
    const userId = req.userId;
    const { productId } = req.body;

    //verificar que el producto no sea nulo o indefinido
    if (!productId) {
        return res.status(400).json({
            success: false,
            message: "El ID del producto es requerido.",
            status: 400
        });
    }

    const result = await getRemoveFromCart(userId,productId);

    if(result.status >= 400){
        console.log(result);
       return res.status(result.status).json(result);
    }
    return res.json(result);
});


module.exports = router;
