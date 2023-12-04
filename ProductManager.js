import fs from 'fs';

class ProductManager {
  #filePath;
  #lastId = 0;

  constructor(filePath = './productos.json') {
    this.#filePath = filePath;
    this.#setLastId();
  }

  async addProduct(product) {
    try {
      const products = await this.getProducts();

      if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
        throw new Error('Todos los campos son obligatorios.');
      }

      const existingProduct = products.find((p) => p.code === product.code);
      if (existingProduct) {
        throw new Error('El código del producto ya existe.');
      }

      product.id = ++this.#lastId;
      products.push(product);

      await this.#saveProducts(products);

      return product;
    } catch (error) {
      console.error('Error al agregar el producto:', error.message);
      throw error;
    }
  }

  async getProducts() {
    try {
      if (fs.existsSync(this.#filePath)) {
        const products = await fs.promises.readFile(this.#filePath, 'utf-8');
        return JSON.parse(products);
      }
      return [];
    } catch (error) {
      console.error('Error al obtener los productos:', error.message);
      throw error;
    }
  }

  async getProductById(id) {
    try {
      const products = await this.getProducts();
      const product = products.find((p) => p.id === id);
      return product || null;
    } catch (error) {
      console.error('Error al obtener el producto por ID:', error.message);
      throw error;
    }
  }

  async updateProduct(id, updatedFields) {
    try {
      const products = await this.getProducts();
      const index = products.findIndex((p) => p.id === id);
      
      if (index !== -1) {
        products[index] = { ...products[index], ...updatedFields };
        await this.#saveProducts(products);
        return products[index];
      }
      return null;
    } catch (error) {
      console.error('Error al actualizar el producto:', error.message);
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      let products = await this.getProducts();
      products = products.filter((p) => p.id !== id);
      await this.#saveProducts(products);
    } catch (error) {
      console.error('Error al eliminar el producto:', error.message);
      throw error;
    }
  }

  async #setLastId() {
    try {
      const products = await this.getProducts();
      if (products.length > 0) {
        this.#lastId = Math.max(...products.map((p) => p.id));
      }
    } catch (error) {
      console.error('Error al establecer el último ID:', error.message);
      throw error;
    }
  }

  async #saveProducts(products) {
    try {
      await fs.promises.writeFile(this.#filePath, JSON.stringify(products, null, 2));
    } catch (error) {
      console.error('Error al guardar los productos:', error.message);
      throw error;
    }
  }
}

// Ejemplo de uso:
const productManager = new ProductManager('./productos.json');

// ... Aquí irían las llamadas a los métodos, similares al uso del StudentsManager


// Agregar un producto
productManager.addProduct({
  title: 'Producto 1',
  description: 'Descripción del producto 1',
  price: 10.99,
  thumbnail: 'imagen1.jpg',
  code: 'P001',
  stock: 50
}).then(newProduct => {
  console.log('Producto agregado:', newProduct);
}).catch(error => {
  console.error(error.message);
});

// Obtener todos los productos
productManager.getProducts().then(products => {
  console.log('Todos los productos:', products);
}).catch(error => {
  console.error(error.message);
});

// Obtener producto por ID
productManager.getProductById(1).then(product => {
  console.log('Producto por ID:', product);
}).catch(error => {
  console.error(error.message);
});

// Actualizar un producto por ID
productManager.updateProduct(1, { price: 15.99 }).then(updatedProduct => {
  console.log('Producto actualizado:', updatedProduct);
}).catch(error => {
  console.error(error.message);
});

// Eliminar un producto por ID
productManager.deleteProduct(1).then(() => {
  console.log('Producto eliminado');
}).catch(error => {
  console.error(error.message);
});