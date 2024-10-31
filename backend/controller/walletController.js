const express = require('express');
const router = express.Router();
const verifyToken = require('../../middleware/verifyToken');
const {getShowProfile} = require("../services/walletService");

@Swagger
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
//-- testeado y to good :D

// Ruta para mostrar el perfil del usuario (wallet)
router.get('/',verifyToken, async (req, res) => {
    const userId = req.userId; // Supongamos que obtienes el userId del middleware de autenticación
    console.log("ViewProfile",req.body);
    const result = await getShowProfile(userId);

    res.json(result);
});

/*
*
* Tienes que probar los enpoints antes de decir que estan listo eso, ya que no carga el aplicativo cuando se reliza
* el node app.js
*
* Te falta otro controlador, porque tienes que separar la responsabilidad de obtener la informacion del cliente
* y la informacion de las compras del clientes
*
* */




module.exports = router;
