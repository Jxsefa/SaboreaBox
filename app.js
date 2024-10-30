require('dotenv').config();
const express = require('express');
const { neon } = require('@neondatabase/serverless');
const cookieParser = require('cookie-parser');
const { engine } = require('express-handlebars');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const authRoutes = require('./backend/controller/auth'); // Importar rutas de autenticación
const adminRoutes = require('./backend/controller/admin'); // Rutas de administración
const walletRoutes = require('./backend/controller/wallet');
const productRoutes = require('./backend/controller/productController');
const cartRoutes = require('./backend/controller/cart');
const paymentRoutes = require('./backend/controller/paymentController');
const setNavbarAuth = require('./middleware/verifyTokenNav');
const app = express();
const PORT = 2000;


const sql = neon(process.env.DATABASE_URL);
console.log('DATABASE_URL:', process.env.DATABASE_URL);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(setNavbarAuth)

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

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de SaboreaBox',
            version: '1.0.0',
            description: 'Documentación de la API de SaboreaBox',
        },
        servers: [
            {
                url: 'http://localhost:2000',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./backend/controller/**/*.js'],
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


app.use(express.static('./'));

app.use('/', authRoutes);
app.use('/admin', adminRoutes);
app.use('/user', walletRoutes);
app.use('/cart', cartRoutes)
app.use('/products', productRoutes);
app.use('/auth', authRoutes);
app.use('/payment',paymentRoutes)


app.get('/', (req, res) => res.render('home', { title: 'Inicio' }));
app.get('/admin', (req, res) => res.render('admin', { title: 'Administración' }));
app.get('/login', (req, res) => res.render('login', { title: 'Inicio sesión' }));
app.get('/register', (req, res) => res.render('register', { title: 'Registro' }));
app.get('/cart', (req, res) => res.render('cart', { title: 'Carrito de Compras' }));
// Inicia el servidor en el puerto definido

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log(`Documentación en http://localhost:${PORT}/api-docs`);
});
