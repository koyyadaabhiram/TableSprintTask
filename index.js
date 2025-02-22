let express = require("express")
let cors = require("cors")
let route = require("./Routes/route")
require("dotenv").config()

let app = express()
app.use(express.json())
app.use(cors())

app.use("/", route)

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})
