require('dotenv').config();
const express = require('express');
const { neon } = require('@neondatabase/serverless');
const cookieParser = require('cookie-parser');
const { engine } = require('express-handlebars');
const authRoutes = require('./routes/auth'); // Importar rutas de autenticación
const adminRoutes = require('./routes/admin'); // Rutas de administración
const walletRoutes = require('./routes/wallet');

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
app.engine('handlebars', engine({
    helpers: {
        calculateSubtotal: function(cart) {
            return cart.reduce((subtotal, item) => subtotal + item.price * item.quantity, 0);
        },
        calculateTotal: function(cart) {
            const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
            const shippingCost = 2000; // Costo fijo de envío
            return subtotal + shippingCost;
        }
    }
}));
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

app.engine('handlebars', engine({
    helpers: {
        eq: function(a, b) {
            return a === b;
        },
        // Otros helpers que tengas...
    }
}));
app.set('view engine', 'handlebars');

// Middleware para servir archivos estáticos
app.use(express.static('./'));
// Usar rutas de autenticación
app.use('/', authRoutes);
app.use('/admin', adminRoutes); // Rutas de administración

// Inicializar un carrito en memoria (solo para simplificación temporal)
let cart = [];

// Ruta para obtener y mostrar los productos en la vista 'products'
app.get('/products', async (req, res) => {
    try {
        // Obtener todos los productos activos
        const products = await sql`SELECT id, name, price, stock, category, description, content, image_url FROM products WHERE active = true`;

        // Renderizar la vista 'products' pasando los productos
        res.render('products', { title: 'Catálogo de Productos', products });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).send('Error en el servidor.');
    }
});

// Ruta para mostrar el carrito de compras
app.get('/cart', async (req, res) => {
    try {
        // Obtener los IDs de los productos en el carrito
        const productIds = cart.map(item => parseInt(item.id));

        // Obtener los productos en el carrito desde la base de datos
        const productsInCart = await sql`SELECT * FROM products WHERE id = ANY(${productIds})`;

        // Añadir la cantidad a cada producto solo si se encuentra en el carrito
        const detailedCart = productsInCart.map(product => {
            const cartItem = cart.find(item => parseInt(item.id) === product.id);
            return { ...product, quantity: cartItem ? cartItem.quantity : 1 };
        });

        // Renderizar la vista del carrito con el contenido actualizado
        res.render('cart', { title: 'Carrito de Compras', cart: detailedCart });
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).send('Error en el servidor.');
    }
});

// Ruta para agregar productos al carrito
app.post('/cart/add', async (req, res) => {
    const { productId } = req.body;

    // Convertir el ID a número si es necesario
    const parsedProductId = parseInt(productId);

    // Verificar si el producto ya está en el carrito
    const productInCart = cart.find(item => item.id === parsedProductId);
    if (productInCart) {
        productInCart.quantity += 1; // Incrementar la cantidad si ya está en el carrito
    } else {
        cart.push({ id: parsedProductId, quantity: 1 }); // Agregar nuevo producto
    }

    res.json({ message: 'Producto añadido al carrito.' });
});

// Ruta para eliminar productos del carrito
app.delete('/cart/delete', (req, res) => {
    const { productId } = req.body;

    // Convertir el ID a número si es necesario
    const parsedProductId = parseInt(productId);

    // Filtrar el carrito para eliminar el producto específico
    cart = cart.filter(item => item.id !== parsedProductId);

    res.json({ message: 'Producto eliminado del carrito.' });
});
app.use('/user', walletRoutes);

// Rutas adicionales (se mantienen sin cambios)
app.get('/', (req, res) => res.render('home', { title: 'Inicio' }));
app.get('/admin', (req, res) => res.render('admin', { title: 'Administración' }));
app.get('/login', (req, res) => res.render('login', { title: 'Inicio sesión' }));
app.get('/register', (req, res) => res.render('register', { title: 'Registro' }));
app.get('/user', (req, res) => res.render('user', { title: 'Usuario' }));

// Inicia el servidor en el puerto definido
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
