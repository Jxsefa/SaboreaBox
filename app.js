require('dotenv').config();

const express = require('express');
const { neon } = require('@neondatabase/serverless');
const cookieParser = require('cookie-parser');
const { engine } = require('express-handlebars');

const app = express();
const PORT = 2000;

// Conectar a la base de datos Neon
const sql = neon(process.env.DATABASE_URL);
console.log('DATABASE_URL:', process.env.DATABASE_URL);

// Middleware para manejar cookies y datos JSON
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar Handlebars como motor de vistas
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

// Middleware para servir archivos estáticos
app.use(express.static('./'));

// Importar y usar rutas de autenticación
const authRoutes = require('./routes/auth');
app.use('/', authRoutes); // Usar las rutas de autenticación

// Rutas principales
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
    res.render('login', { title: 'Inicio sesión' });
});
app.get('/products', (req, res) => {
    res.render('products', { title: 'Productos' });
});
app.get('/register', (req, res) => {
    res.render('register', { title: 'Registro' });
});
app.get('/user', (req, res) => {
    res.render('user', { title: 'Usuario' });
});

// Inicia el servidor en el puerto definido
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
