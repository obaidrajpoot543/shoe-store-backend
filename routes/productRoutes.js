const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const router = express.Router();

const filePath = path.join(__dirname, "../data/products.json");


// Image upload settings
const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../uploads"));
    },

    filename: function (req, file, cb) {
        const uniqueName = Date.now() + "-" + file.originalname;
        cb(null, uniqueName);
    }

});

const upload = multer({ storage: storage });


// Get all products
router.get("/", (req, res) => {

    const products = JSON.parse(
        fs.readFileSync(filePath, "utf-8")
    );

    res.json(products);
});


// Add product with image
router.post("/", upload.single("image"), (req, res) => {

    const products = JSON.parse(
        fs.readFileSync(filePath, "utf-8")
    );

    const newId =
        products.length > 0
            ? Math.max(...products.map(product => product.id)) + 1
            : 1;

    const newProduct = {

        id: newId,

        name: req.body.name,

        price: Number(req.body.price),

        image: req.file
            ? `http://localhost:5000/uploads/${req.file.filename}`
            : ""

    };

    products.push(newProduct);

    fs.writeFileSync(
        filePath,
        JSON.stringify(products, null, 2)
    );

    res.status(201).json({

        message: "Product added successfully!",

        product: newProduct

    });

});


// Delete product
router.delete("/:id", (req, res) => {

    const products = JSON.parse(
        fs.readFileSync(filePath, "utf-8")
    );

    const productId = parseInt(req.params.id);

    const filteredProducts = products.filter(
        product => product.id !== productId
    );

    if (products.length === filteredProducts.length) {

        return res.status(404).json({
            message: "Product not found!"
        });

    }

    fs.writeFileSync(
        filePath,
        JSON.stringify(filteredProducts, null, 2)
    );

    res.json({
        message: "Product deleted successfully!"
    });

});


// Update product
router.put("/:id", (req, res) => {

    const products = JSON.parse(
        fs.readFileSync(filePath, "utf-8")
    );

    const productId = parseInt(req.params.id);

    const product = products.find(
        product => product.id === productId
    );

    if (!product) {

        return res.status(404).json({
            message: "Product not found!"
        });

    }

    product.name = req.body.name;

    product.price = Number(req.body.price);

    product.image = req.body.image;

    fs.writeFileSync(
        filePath,
        JSON.stringify(products, null, 2)
    );

    res.json({

        message: "Product updated successfully!",

        product: product

    });

});


module.exports = router;