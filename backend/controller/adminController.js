const express = require('express');
const router = express.Router();
const {getGeneralBalance} = require('../services/adminService');

@Swagger
/*
/Sales:
    get:
      summary: Muestra el balance general del e-commerce
      description: Despliega los datos correspondientes a las ventas totales, productos, usuarios
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
//--duda

// Ruta del Dashboard de Administración (GET /admin)
router.get('/', async (req, res) => {
    console.log("Sales",req.body);
    const result = await getGeneralBalance();
    res.json(result);
});

module.exports = router;
