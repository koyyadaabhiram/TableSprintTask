const db = require("../db")
const multer = require("multer")

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

exports.getcategory = (req, res) => {
    db.query("SELECT id, categoryname, status, sequence, image FROM category", (err, results) => {
        if (err) {
            console.error("Database Error:", err)
            return res.status(500).json({ error: "Database error" })
        }
        const modifiedResults = results.map(category => ({
            ...category,
            image: category.image ? `data:image/jpeg;base64,${category.image.toString("base64")}` : null
        }))
        res.json(modifiedResults)
    })
}

exports.addcategory = [
    upload.single("image"),
    (req, res) => {
        const { categoryname, sequence } = req.body
        const image = req.file ? req.file.buffer : null

        if (!categoryname || !sequence || !image) {
            return res.status(400).json({ error: "All fields are required" })
        }

        db.query(
            "INSERT INTO Category (categoryname, sequence, image) VALUES (?, ?, ?)",
            [categoryname, sequence, image],
            (err, result) => {
                if (err) {
                    console.error("Insert Error:", err)
                    return res.status(500).json({ error: "Failed to add category" })
                }
                res.status(201).json({ message: "category added successfully", categoryId: result.insertId })
            }
        )
    }
]

exports.updatecategory = [
    upload.single("image"),
    (req, res) => {
        const { categoryname, sequence, status } = req.body
        const image = req.file ? req.file.buffer : null
        const { id } = req.params

        if (!categoryname || !sequence || !status) {
            return res.status(400).json({ error: "categoryname, sequence, and status are required" })
        }

        let query = "UPDATE category SET categoryname=?, sequence=?, status=?"
        let params = [categoryname, sequence, status]

        if (image) {
            query += ", image=?"
            params.push(image)
        }

        query += " WHERE id=?"
        params.push(id)

        db.query(query, params, (err, result) => {
            if (err) {
                console.error("Update Error:", err)
                return res.status(500).json({ error: "Failed to update category" })
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "category not found" })
            }
            res.json({ message: "category updated successfully" })
        })
    }
]

exports.deletecategory = (req, res) => {
    const { id } = req.params

    db.query("DELETE FROM category WHERE id=?", [id], (err, result) => {
        if (err) {
            console.error("Delete Error:", err)
            return res.status(500).json({ error: "Failed to delete category" })
        }
        if (result.affectedRows === 0) {
           return res.status(404).json({ error: "category not found" })
        }
        res.json({ message: "category deleted successfully" })
    })
}
