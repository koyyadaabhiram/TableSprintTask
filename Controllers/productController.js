const db = require("../db")
const multer = require("multer")

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

exports.getProducts = (req, res) => {
    db.query("SELECT id, name, status, sequence, image FROM products", (err, results) => {
        if (err) {
            console.error("Database Error:", err)
            return res.status(500).json({ error: "Database error" })
        }
        const modifiedResults = results.map(product => ({
            ...product,
            image: product.image ? `data:image/jpeg;base64,${product.image.toString("base64")}` : null
        }))
        res.json(modifiedResults)
    })
}

exports.addProduct = [
    upload.single("image"),
    (req, res) => {
        const { name, sequence } = req.body
        const image = req.file ? req.file.buffer : null

        if (!name || !sequence || !image) {
            return res.status(400).json({ error: "All fields are required" })
        }

        db.query(
            "INSERT INTO products (name, sequence, image) VALUES (?, ?, ?)",
            [name, sequence, image],
            (err, result) => {
                if (err) {
                    console.error("Insert Error:", err)
                    return res.status(500).json({ error: "Failed to add product" })
                }
                res.status(201).json({ message: "Product added successfully", productId: result.insertId })
            }
        )
    }
]

exports.updateProduct = [
    upload.single("image"),
    (req, res) => {
        const { name, sequence, status } = req.body
        const image = req.file ? req.file.buffer : null
        const { id } = req.params

        if (!name || !sequence || !status) {
            return res.status(400).json({ error: "Name, sequence, and status are required" })
        }

        let query = "UPDATE products SET name=?, sequence=?, status=?"
        let params = [name, sequence, status]

        if (image) {
            query += ", image=?"
            params.push(image)
        }

        query += " WHERE id=?"
        params.push(id)

        db.query(query, params, (err, result) => {
            if (err) {
                console.error("Update Error:", err)
                return res.status(500).json({ error: "Failed to update product" })
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Product not found" })
            }
            res.json({ message: "Product updated successfully" })
        })
    }
]

exports.deleteProduct = (req, res) => {
    const { id } = req.params

    db.query("DELETE FROM products WHERE id=?", [id], (err, result) => {
        if (err) {
            console.error("Delete Error:", err)
            return res.status(500).json({ error: "Failed to delete product" })
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Product not found" })
        }
        res.json({ message: "Product deleted successfully" })
    })
}
