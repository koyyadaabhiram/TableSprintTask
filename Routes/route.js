let express = require("express")
let { reguser, login } = require("../Controllers/logincon")
const { getcategory, addcategory, updatecategory, deletecategory } = require("../Controllers/CController")

let route = new express.Router()

route.post("/reguser", reguser)
route.post("/login", login)

route.get("/category", getcategory)
route.post("/category", addcategory)
route.put("/category/:id", updatecategory)
route.delete("/category/:id", deletecategory)

module.exports = route
