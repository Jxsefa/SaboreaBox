require('dotenv').config();

const express = require('express');
const http = require("http");
const { neon } = require("@neondatabase/serverless");

const { engine } = require('express-handlebars');

const app = express();
const PORT = 2000;

//Base de Datos
const sql = neon(process.env.DATABASE_URL);

const requestHandler = async (req, res) => {
    const result = await sql`SELECT version()`;
    const { version } = result[0];
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(version);
};

http.createServer(requestHandler).listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});


// Configurar Handlebars como motor de vistas
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

// Middleware para servir archivos estáticos
app.use(express.static('./'));


// Rutas
app.get('/', (req, res) => {
    res.render('home', { title: 'Inicio' });
});
app.get('/admin', (req, res) => {
    res.render('admin', { title: 'Administración' });
});
app.get('/cart', (req, res) => {
    res.render('cart', { title: 'Carro compras' });
});
app.get('/login', (req, res) => {
    res.render('login', { title: 'Inicio secion' });
});
app.get('/products', (req, res) => {
    res.render('products', { title: 'Productos' });
});
app.get('/login/register', (req, res) => {
    res.render('register', { title: 'Registro' });
});
app.get('/user', (req, res) => {
    res.render('user', { title: 'Usuario' });
});

// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

