const express = require('express');
const router = express.Router();
const {getGeneralBalance} = require('../services/adminService');

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
router.get('/', async (req, res) => {
    console.log("Sales",req.body);
    const result = await getGeneralBalance();
    res.json(result);
});

module.exports = router;



/*
*  Tienes que probar los enpoints antes de decir que estan listo eso, ya que no carga el aplicativo cuando se reliza
* el node app.js
*
* Lo mismo que te paso en wallet, tienes que separa la responsabilidad en 3 endpoint, para obtener el
* El monto total vendido en el mes
* Total de productos comprados,
* y los usuarios activos en el mes
*
*
* */