const express = require('express');
const router = express.Router();
const {neon} = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);
require('dotenv').config();
const verifyToken = require('../../middleware/verifyToken');
const {generatorPayment} = require('../services/paymentService');

/**
 * @swagger
 * /payment:
 *   post:
 *     summary: Genera un pago para el usuario
 *     tags: [Pagos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: El endpoint no requiere un cuerpo en la solicitud, solo el ID de usuario extraído del token
 *       required: false
 *     responses:
 *       200:
 *         description: Pago realizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "pago realizado correctamente"
 *                 status:
 *                   type: integer
 *                   example: 200
 *       400:
 *         description: Carrito vacío
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
 *                   example: "Carrito vacío"
 *                 status:
 *                   type: integer
 *                   example: 400
 *       402:
 *         description: Saldo insuficiente
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
 *                   example: "Saldo insuficiente"
 *                 status:
 *                   type: integer
 *                   example: 402
 *       500:
 *         description: Error en el servidor
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
 *                   example: "Error del servidor"
 *                 status:
 *                   type: integer
 *                   example: 500
 */



router.post('/', verifyToken, async (req, res) => {
    console.log("payment", req.body);
    const userId = req.userId;
    const result = await generatorPayment(userId, res);
    if(result.status >= 400) {
        return res.status(result.status).json({result})
    }
    res.json(result);

});

module.exports = router;