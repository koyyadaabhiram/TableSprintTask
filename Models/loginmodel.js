const db = require("../db")

const findUserByEmail = (email, callback) => {
    let sql = "SELECT * FROM login WHERE email = ?"
    db.query(sql, [email], (err, result) => {
        if (err) return callback(err, null)
        return callback(null, result[0])
    })
}

const createUser = (email, name, hashedPwd, callback) => {
    let sql = "INSERT INTO login (email, name, pwd) VALUES (?, ?, ?)"
    db.query(sql, [email, name, hashedPwd], (err, result) => {
        if (err) return callback(err, null)
        return callback(null, result)
    })
}

const updateProduct = (id, name, sequence, status, callback) => {
    const sql = "UPDATE products SET name = ?, sequence = ?, status = ? WHERE id = ?"
    db.query(sql, [name, sequence, status, id], callback)
}

module.exports = { findUserByEmail, createUser, updateProduct }
