const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const productRoutes = require("./routes/productRoutes");

const app = express();

app.use(cors());
app.use(express.json());


// Images folder ko public banana
app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
);


app.get("/", (req, res) => {
    res.send("Backend is running!");
});


app.use("/api/products", productRoutes);


const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});