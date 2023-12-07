import express from "express";
import { ProductManager } from "./ProductManager.js";

const app = express();
const productManager = new ProductManager(); 

const PORT = 3000;

app.get("/api/productos", async (req, res) => {
  try {
    const { limit } = req.query;
    const products = await productManager.getProducts();

    if (!limit) {
      res.status(200).send({
        success: true,
        data: products,
      });
    } else {
      const limitedProducts = products.filter(product => product.id <= limit);
      res.status(200).send({
        success: true,
        data: limitedProducts,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
    });
  }
});

app.get("/api/productos/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    if (isNaN(pid)) {
      throw new Error("ID must be a number");
    }

    const product = await productManager.getProductById(pid); // Usar la instancia

    if (!product) {
      throw new Error(`Product with ID ${pid} was not found`);
    }

    res.status(200).send({
      success: true,
      data: product,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
    });
  }
});

app.listen(PORT, (error) => {
  if (error) {
    console.error(error);
  }
  console.log(`Servidor activo en localhost:${PORT}`);
});
