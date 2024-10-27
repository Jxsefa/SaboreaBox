DROP TABLE IF EXISTS order_details CASCADE ;
DROP TABLE IF EXISTS orders CASCADE ;
DROP TABLE IF EXISTS carts CASCADE ;
DROP TABLE IF EXISTS products CASCADE ;
DROP TABLE IF EXISTS auth CASCADE ;
DROP TABLE IF EXISTS users CASCADE ;


CREATE TABLE products (
                          id SERIAL PRIMARY KEY,  -- Identificador único del producto (autoincremental)
                          name VARCHAR(100) NOT NULL,  -- Nombre del producto
                          price INTEGER NOT NULL,  -- Precio del producto (sin decimales, para pesos chilenos)
                          stock INTEGER NOT NULL,  -- Cantidad disponible en inventario
                          category VARCHAR(50) CHECK (category IN ('Principal', 'Entrada', 'Postre')) NOT NULL,  -- Solo permite las opciones 'principal', 'entrada', o 'postre'
                          description TEXT,  -- Descripción del producto
                          content TEXT,  -- Contenido del producto (por ejemplo, ingredientes)
                          image_url VARCHAR(500),  -- URL de la imagen del producto
                          active BOOLEAN DEFAULT TRUE,  -- Indica si el producto está activo (TRUE) o deshabilitado (FALSE)
                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Fecha y hora de creación del registro
); --Producto





CREATE TABLE auth (
                      email VARCHAR(200) PRIMARY KEY,  -- Correo electrónico como llave primaria (debe ser único)
                      password VARCHAR(255) NOT NULL,  -- Contraseña cifrada (se recomienda almacenar la versión cifrada/hasheada)
                      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Fecha y hora de creación del registro
);-- autentificacion
CREATE TABLE users (
                       id SERIAL PRIMARY KEY,
                       username VARCHAR(100) UNIQUE NOT NULL,  -- Nombre de usuario único
                       email VARCHAR(200) REFERENCES auth(email),
                       role VARCHAR(50) CHECK (role IN ('admin', 'customer')) NOT NULL,
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       balance INTEGER NOT NULL default 0

); --Usuario

CREATE TABLE carts (
                       id SERIAL PRIMARY KEY,  -- Identificador único del carrito
                       user_id INTEGER REFERENCES users(id),  -- Relación con el usuario (se elimina si el usuario se elimina)
                       product_id INTEGER REFERENCES products(id),  -- Relación con el producto
                       quantity INTEGER NOT NULL -- Cantidad de productos agregados al carrito
); --Carrito



CREATE TABLE orders (
                        id SERIAL PRIMARY KEY,  -- Identificador único de la orden (autoincremental)
                        user_id INTEGER REFERENCES users(id),  -- Relación con el usuario que realiza la orden
                        amount_without_shipping INTEGER NOT NULL,  -- Monto total sin envío
                        shipping_cost INTEGER DEFAULT 2000,  -- Costo fijo de envío
                        total_amount INTEGER GENERATED ALWAYS AS (amount_without_shipping + shipping_cost) STORED,  -- Monto total con envío (calculado automáticamente)
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Fecha y hora en que se creó la orden
); --Ordenes

CREATE TABLE order_details (
                               id SERIAL PRIMARY KEY,  -- Identificador único del detalle de la orden
                               order_id INTEGER REFERENCES orders(id),  -- Relación con la tabla de órdenes
                               product_id INTEGER REFERENCES products(id),  -- Relación con la tabla de productos
                               quantity INTEGER NOT NULL,  -- Cantidad de unidades compradas de este producto
                               price INTEGER NOT NULL  -- Precio del producto en el momento de la compra
); --Ordenes detalladas

CREATE UNIQUE INDEX user_product_unique ON carts(user_id, product_id);

INSERT INTO users (username, role)
VALUES
    ('admin_user', 'admin'),
    ('customer1', 'customer'),
    ('customer2', 'customer'),
    ('customer3', 'customer');

INSERT INTO products (name, price, stock, category, description, content, image_url)
VALUES
    ('Tiramisu Box', 10000, 50, 'Postre', 'Caja con ingredientes para hacer Tiramisu', 'Incluye queso mascarpone, café, etc.', '/public/images/Postre/tiramisu1.jpg'),
    ('Machas Box', 15000, 30, 'Entrada', 'Caja con ingredientes para hacer Machas a la Parmesana', 'Incluye machas, queso parmesano, etc.', '/public/images/Entreadas/Machas-a-la-Parmesana.jpg'),
    ('Porotos Box', 8000, 50, 'Principal', 'Caja con ingredientes para hacer Porotos', 'Incluye porotos, zapallo, etc.', '/public/images/Principal/Porotos.jpg'),
    ('Fideos Box', 6000, 80, 'Principal', 'Caja con ingredientes para hacer Fideos', 'Incluye fideos, salsa de tomate, etc.', '/public/images/Principal/Fideos.jpg');

INSERT INTO carts (user_id, product_id, quantity)
VALUES
    (2, 1, 2),  -- El usuario con ID 2 (customer1) agregó 2 unidades de Tiramisu Box
    (2, 3, 1),  -- El usuario con ID 2 (customer1) agregó 1 unidad de Porotos Box
    (3, 2, 1);  -- El usuario con ID 3 (customer2) agregó 1 unidad de Machas Box

INSERT INTO orders (user_id, amount_without_shipping)
VALUES
    (2, 20000),  -- Usuario customer1 hace una orden de 20,000 sin el envío
    (3, 15000);  -- Usuario customer2 hace una orden de 15,000 sin el envío

INSERT INTO order_details (order_id, product_id, quantity, price)
VALUES
    (1, 1, 2, 10000),  -- Orden 1: 2 unidades de Tiramisu Box a 10,000 cada uno
    (1, 3, 1, 8000),   -- Orden 1: 1 unidad de Porotos Box a 8,000
    (2, 2, 1, 15000);  -- Orden 2: 1 unidad de Machas Box a 15,000

INSERT INTO auth (email, password)
VALUES
    ('admin_user@example.com', 'adminpassword123'),
    ('customer1@example.com', 'password123'),
    ('customer2@example.com', 'mypassword'),
    ('customer3@example.com', 'anotherpassword');