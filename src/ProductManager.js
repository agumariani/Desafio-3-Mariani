import fs from "fs";

// Define la clase ProductManager para gestionar productos.
export class ProductManager {
    constructor() {
        // Inicializa un arreglo de productos, el próximo ID de producto y el nombre de archivo.
        this.products = [];
        this.nextProductId = 1;
        this.productFileName = "./src/products.json";
    }

    // Método para agregar un nuevo producto.
    async addProduct(title, description, price, thumbnail, code, stock) {
        // Valida si todos los campos requeridos están presentes.
        if (
            !title ||
            !description ||
            !price ||
            !thumbnail ||
            !code ||
            stock === undefined
        ) {
            console.error("Todos los campos son obligatorios.");
            return Promise.reject("Todos los campos son obligatorios.");
        }

        // Comprueba si un producto con el mismo código ya existe.
        if (this.products.some((product) => product.code === code)) {
            console.error(`El producto con código ${code} ya existe.`);
            return Promise.reject(`El producto con código ${code} ya existe.`);
        }

        // Crea un nuevo producto con un ID único y otros detalles.
        const newProduct = {
            id: this.nextProductId++,
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
        };

        // Agrega el producto al arreglo de productos.
        this.products.push(newProduct);

        // Intenta guardar los productos en un archivo.
        try {
            await this.saveProductsToFile();
            console.log(`Producto con código ${code} agregado correctamente.`);
        } catch (err) {
            console.error("Error al guardar los productos en el archivo.");
            return Promise.reject(err);
        }
    }

    // Método para obtener todos los productos.
    getProducts() {
        return this.products;
    }

    // Método para obtener un producto por su ID.
    getProductById(id) {
        const product = this.products.find((product) => product.id === id);
        if (product) {
            return product;
        } else {
            console.error("Producto no encontrado.");
            return null;
        }
    }

    // Método para actualizar un producto por su ID.
    async updateProduct(id, updatedProduct) {
        const index = this.products.findIndex((product) => product.id === id);
        if (index === -1) {
            console.error("Producto no encontrado.");
            return Promise.reject("Producto no encontrado.");
        }

        // Actualiza el producto con nuevos detalles.
        this.products[index] = { ...this.products[index], ...updatedProduct };

        // Intenta guardar los productos actualizados en un archivo.
        try {
            await this.saveProductsToFile();
            console.log(`Producto con ID ${id} actualizado correctamente.`);
        } catch (err) {
            console.error("Error al guardar los productos en el archivo.");
            return Promise.reject(err);
        }
    }

    // Método para eliminar un producto por su ID.
    async deleteProduct(id) {
        const index = this.products.findIndex((product) => product.id === id);
        if (index === -1) {
            console.error("Producto no encontrado.");
            return Promise.reject("Producto no encontrado.");
        }

        // Elimina el producto del arreglo.
        this.products.splice(index, 1);

        // Intenta guardar los productos actualizados en un archivo.
        try {
            await this.saveProductsToFile();
            console.log(`Producto con ID ${id} eliminado correctamente.`);
        } catch (err) {
            console.error("Error al guardar los productos en el archivo.");
            return Promise.reject(err);
        }
    }

    // Método para guardar los productos en un archivo.
    async saveProductsToFile() {
        try {
            await fs.promises.writeFile(
                this.productFileName,
                JSON.stringify(this.products, null, 2)
            );
        } catch (error) {
            console.error("Error al guardar los productos en el archivo.");
            return Promise.reject(error);
        }
    }

    // Método para cargar productos desde un archivo (o inicializar si es la primera vez).
    async loadProductsFromFile() {
        try {
            const data = await fs.promises.readFile(this.productFileName, "utf8");
            this.products = JSON.parse(data);

            // Calcula el próximo ID de producto en función de los productos existentes.
            if (this.products.length > 0) {
                this.nextProductId =
                    Math.max(...this.products.map((product) => product.id)) + 1;
            }
        } catch (error) {
            // No se pudo leer el archivo, puede ser la primera ejecución o el archivo no existe.
            // En este caso, los productos se inicializarán vacíos.
        }
    }
}

// Función asincrónica para probar las operaciones del administrador de productos.
async function main() {
    try {
        // Crea una instancia de ProductManager.
        const productManager = new ProductManager();

        // Carga productos desde un archivo (o inicializa si es la primera vez).
        await productManager.loadProductsFromFile();

        // Agrega tres productos de ejemplo.

        await productManager.addProduct(
            "Aspirina",
            "Alivio rapido para el dolor de cabeza y fiebre",
            5.99,
            "aspirina.jpg",
            "FARM001",
            100
        );

        await productManager.addProduct(
            "Ibuprofeno",
            "Antiinflamatorio y analgesico",
            7.49,
            "Ibuprofeno.jpg",
            "FARM002",
            80
        );
        await productManager.addProduct(
            "Paracetamol",
            "Alivia el dolor y reduce la fiebre",
            4.99,
            "Paracetamol.jpg",
            "FARM003",
            120
        );

        await productManager.addProduct(
            "Vitamina C",
            "Suplemento de vitamina C para fortalecer el sistema inmunologico",
            8.99,
            "VitaminaC.jpg",
            "FARM004",
            60
        );
        await productManager.addProduct(
            "Antiacido",
            "Alivia la acidez estomacal",
            6.99,
            "Antiacido.jpg",
            "FARM005",
            50
        );

        // Obtiene y muestra todos los productos.
        const allProducts = productManager.getProducts();
        console.log("Todos los productos:", allProducts);

        // Actualiza un producto y muestra los productos actualizados.
        const productIdToUpdate = 1;
        await productManager.updateProduct(productIdToUpdate, {
            price: 899.99,
            stock: 20,
        });

        // Elimina un producto y muestra los productos actualizados.
        const productIdToDelete = 4;
        await productManager.deleteProduct(productIdToDelete);

        console.log("Productos actualizados:", productManager.getProducts());
    } catch (err) {
        console.error("Error en la operación:", err);
    }
}

// Llama a la función principal.
main();