const express = require('express');
const router = express.Router();
const {getSale, getSold, getUserActive} = require('../services/adminService');

//@Swagger
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
router.get('/sale', async (req, res) => {
    console.log("Sales",req.body);
    const result = await getSale();
    res.json(result);
});

router.get('/sold', async (req, res) => {
    console.log("Sales",req.body);
    const result = await getSold();
    res.json(result);
});

router.get('/user-active', async (req, res) => {
    console.log("Sales",req.body);
    const result = await getUserActive();
    res.json(result);
});

module.exports = router;
