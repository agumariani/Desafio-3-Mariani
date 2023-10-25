import express from "express";
import { ProductManager } from "./ProductManager.js";

const app = express();
const port = 8080;
const productManager = new ProductManager();

// Cargar productos desde un archivo al iniciar la aplicación.
const loadProducts = async () => {
    try {
        await productManager.loadProductsFromFile();
    } catch (error) {
        console.error("Error al cargar productos desde el archivo:", error);
    }
};

// Middleware para permitir que la aplicación parsee datos en formato JSON.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Obtener todos los productos.
app.get("/products", async (req, res) => {
    try {
        const limit = req.query.limit;
        const products = productManager.getProducts();

        if (limit) {
            const limitedProducts = products.slice(0, limit);
            res.json({ products: limitedProducts });
        } else {
            res.json({ products });
        }
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).json({ error: "Error al obtener productos" });
    }
});


// Obtener un producto por su ID.
app.get("/products/:pid", async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const product = productManager.getProductById(productId);

        if (product) {
            res.json({ product });
        } else {
            res.status(404).json({ error: "Producto no encontrado" });
        }
    } catch (error) {
        console.error("Error al obtener producto por ID:", error);
        res.status(500).json({ error: "Error al obtener producto por ID" });
    }
});

// Función asincrónica para iniciar el servidor Express y escuchar en el puerto especificado.
const startServer = async () => {
    try {
        await loadProducts();
        app.listen(port, () => {
            console.log(`Servidor escuchando por el puerto: ${port}`);
        });
    } catch (error) {
        console.error("Error al iniciar el servidor:", error);
    }
};

// Llama a la función para iniciar el servidor.
startServer();