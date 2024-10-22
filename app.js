const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');

const app = express();
const PORT = 3000;

// Configuración de Handlebars
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware para manejar datos del formulario
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Ruta principal
app.get('/', (req, res) => {
    res.render('home'); // Renderiza la vista 'home.handlebars'
});

// Escucha del servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
