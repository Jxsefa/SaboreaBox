require('dotenv').config();
const express = require('express');
const { neon } = require('@neondatabase/serverless');
const cookieParser = require('cookie-parser');
const { engine } = require('express-handlebars');
const authRoutes = require('./routes/auth'); // Importar rutas de autenticación

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

// Usar rutas de autenticación
app.use('/', authRoutes);

// Ruta para obtener y mostrar los productos en la vista 'products'
app.get('/products', async (req, res) => {
    try {
        // Obtener todos los productos desde la tabla 'products' que estén activos
        const products = await sql`SELECT * FROM products WHERE active = true`;

        // Renderizar la vista 'products' pasando los productos
        res.render('products', { title: 'Catálogo de Productos', products });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).send('Error en el servidor.');
    }
});

// Ruta para obtener y mostrar los productos en la vista 'products'
app.get('/products', async (req, res) => {
    try {
        // Obtener todos los productos desde la tabla 'products' que estén activos
        const products = await sql`SELECT id, name, price, stock, category, description, content, image_url FROM products WHERE active = true`;

        // Renderizar la vista 'products' pasando los productos
        res.render('products', { title: 'Catálogo de Productos', products });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).send('Error en el servidor.');
    }
});


// Rutas adicionales
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
