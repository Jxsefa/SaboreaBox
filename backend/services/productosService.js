// productosService.js
const {neon} = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

async function getProductById(id) {
    try {
        const [product] = await sql`
            SELECT id,
                   name,
                   price,
                   stock,
                   category,
                   description,
                   content,
                   image_url
            FROM products
            WHERE active = true
              AND id = ${id}
        `;

        if (product) {
            return product;

        }
        return {"message": "product not found"};
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        throw error;
    }
}

async function getProducts() {
    return sql`SELECT id,
                      name,
                      price,
                      stock,
                      category,
                      description,
                      content,
                      image_url
               FROM products
               WHERE active = true`;

}

async function deleteProductById(id) {
    console.log("delete Product id ", id)
    try {
        await sql`update products
                  set active = false
                  where id = ${id};`;
        return  { message: 'Producto eliminado exitosamente.' };
    } catch (error) {
        return { message: 'Error al eliminar el producto.' };
    }
}

async function activeProductById(id) {
    console.log("delete Product id ", id)
    try {
        await sql`update products
                  set active = true
                  where id = ${id};`;
        return  { message: 'Producto activado exitosamente.' };
    } catch (error) {
        return { message: 'Error al activar el producto.' };
    }
}

async function saveOrUpdateProduct(productData, imagePath) {
    const { id, name, price, stock, category, description, content } = productData;

    if (!name || !price || !stock || !category) {
        throw new Error('Todos los campos requeridos deben estar llenos.');
    }

    if (id) {
        await sql`
      UPDATE products
      SET name = ${name}, price = ${price}, stock = ${stock}, category = ${category}, 
          image_url = ${imagePath}, description = ${description}, content = ${content}
      WHERE id = ${id}
    `;
        return 'Producto actualizado exitosamente';
    } else {
        if (!imagePath) {
            throw new Error('La imagen es obligatoria.');
        }
        await sql`
      INSERT INTO products (name, price, stock, category, active, image_url, description, content)
      VALUES (${name}, ${price}, ${stock}, ${category}, true, ${imagePath}, ${description}, ${content})
    `;
        return 'Producto guardado exitosamente';
    }
}


module.exports = {getProductById, getProducts, deleteProductById, activeProductById, saveOrUpdateProduct};
