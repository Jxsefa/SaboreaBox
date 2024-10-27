require('dotenv').config();
const express = require('express');
const { neon } = require('@neondatabase/serverless');
const cookieParser = require('cookie-parser');
const { engine } = require('express-handlebars');
const authRoutes = require('./routes/auth'); // Importar rutas de autenticación
const adminRoutes = require('./routes/admin'); // Rutas de administración
const walletRoutes = require('./routes/wallet');
const productRoutes = require('./routes/product');
const cartRoutes = require('./routes/cart');
const app = express();
const PORT = 2000;

// Conectar a la base de datos Neon
const sql = neon(process.env.DATABASE_URL);
console.log('DATABASE_URL:', process.env.DATABASE_URL);

// Middleware para manejar cookies y datos JSON
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar Handlebars como motor de vistas y registrar helpers

app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

app.engine('handlebars', engine({
    helpers: {
        calculateSubtotal: function(cart) {
            return cart.reduce((subtotal, item) => subtotal + item.price * item.quantity, 0);
        },
        calculateTotal: function(cart) {
            const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
            const shippingCost = 2000; // Costo fijo de envío
            return subtotal + shippingCost;
        },
        eq: function(a, b) {
            return a === b;
        },
    }
}));

// Middleware para servir archivos estáticos
app.use(express.static('./'));
// Usar rutas de autenticación
app.use('/', authRoutes);
app.use('/admin', adminRoutes); // Rutas de administración
app.use('/user', walletRoutes);
app.use('/cart', cartRoutes)
app.use('/products', productRoutes);
// Inicializar un carrito en memoria (solo para simplificación temporal)

// Ruta para obtener y mostrar los productos en la vista 'products'


// Rutas adicionales (se mantienen sin cambios)
app.get('/', (req, res) => res.render('home', { title: 'Inicio' }));
app.get('/login', (req, res) => res.render('login', { title: 'Inicio sesión' }));
app.get('/register', (req, res) => res.render('register', { title: 'Registro' }));
// Inicia el servidor en el puerto definido
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
