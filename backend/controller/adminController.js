const express = require('express');
const router = express.Router();
const {getSale, getSold, getUserActive} = require('../services/adminService');

/**
 * @swagger
 * admin/sale:
 *   get:
 *     summary: Obtener total de ventas
 *     description: Devuelve el total de ventas del mes actual.
 *     responses:
 *       200:
 *         description: Total de ventas obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalVentas:
 *                   type: integer
 *                   example: 100000
 *                 status:
 *                   type: integer
 *                   example: 200
 *       500:
 *         description: Error al obtener los datos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Error en el servidor"
 *                 status:
 *                   type: integer
 *                   example: 500
 */

router.get('/sale', async (req, res) => {
    console.log("Sales",req.body);
    const result = await getSale();
    res.json(result);
});

//@Swagger
/*
/sold:
    get:
      summary: Obtener total de productos vendidos
      description: Devuelve la cantidad total de productos vendidos en el mes
      responses:
        '200':
          description: Total de productos vendidos obtenido exitosamente
          content:
            application/json:
              schema:
                type: object
                properties:
                  productosVendidos:
                    type: integer
                    example: 150
                  status:
                    type: integer
                    example: 200
        '500':
          description: Error al obtener la cantidad de productos vendidos
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example: "Error en el servidor."
                  status:
                    type: integer
                    example: 500
 */
router.get('/sold', async (req, res) => {
    console.log("Sales",req.body);
    const result = await getSold();
    res.json(result);
});

//@Swagger
/*
/user-active:
    get:
      summary: Obtener total de usuarios activos
      description: Devuelve el número total de usuarios que han realizado pedidos en el mes actual.
      responses:
        '200':
          description: Total de usuarios activos obtenido exitosamente
          content:
            application/json:
              schema:
                type: object
                properties:
                  usuariosActivos:
                    type: integer
                    example: 75
                  status:
                    type: integer
                    example: 200
        '500':
          description: Error al obtener la cantidad de usuarios activos
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example: "Error en el servidor."
                  status:
                    type: integer
                    example: 500
 */
router.get('/user-active', async (req, res) => {
    console.log("Sales",req.body);
    const result = await getUserActive();
    res.json(result);
});

module.exports = router;
