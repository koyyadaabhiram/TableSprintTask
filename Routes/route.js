let express = require("express")
let { reguser, login } = require("../Controllers/logincon")
const { getProducts, addProduct, updateProduct, deleteProduct } = require("../Controllers/productController")

let route = new express.Router()

route.post("/reguser", reguser)
route.post("/login", login)

route.get("/products", getProducts)
route.post("/products", addProduct)
route.put("/products/:id", updateProduct)
route.delete("/products/:id", deleteProduct)

module.exports = route
