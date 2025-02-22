const db = require("../db")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { findUserByEmail, createUser } = require("../Models/loginmodel")
require("dotenv").config()

const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return emailRegex.test(email)
}

const validatePassword = (pwd) => {
    return pwd.length >= 6
}

const reguser = async (req, res) => {
    try {
        let { email, name, pwd } = req.body
        if (!validateEmail(email)) {
            return res.status(400).json({ "msg": "Invalid email format" })
        }
        if (!validatePassword(pwd)) {
            return res.status(400).json({ "msg": "Password must be at least 6 characters" })
        }
        if (!name || name.trim() === "") {
            return res.status(400).json({ "msg": "Name cannot be empty" })
        }
        let hashedPwd = await bcrypt.hash(pwd, 10)
        createUser(email, name, hashedPwd, (err, result) => {
            if (err) {
                return res.status(400).json({ "msg": "Email already exists or invalid details" })
            }
            res.status(201).json({ "msg": "Registration successful" })
        })
    } catch (error) {
        res.status(500).json({ "msg": "Server error. Please try again later." })
    }
}

const login = async (req, res) => {
    try {
        let { email, pwd } = req.body
        if (!validateEmail(email)) {
            return res.status(400).json({ "msg": "Invalid email format" })
        }
        findUserByEmail(email, async (err, user) => {
            if (err || !user) {
                return res.status(400).json({ "msg": "Email not found" })
            }
            let match = await bcrypt.compare(pwd, user.pwd)
            if (!match) {
                return res.status(400).json({ "msg": "Incorrect password" })
            }
            let token = jwt.sign(
                { email: user.email, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            )
            res.status(200).json({ "token": token, "email": user.email, "name": user.name, "role": user.role })
        })
    } catch (err) {
        res.status(500).json({ "msg": "Server error. Please try again later." })
    }
}

const islogin = (req, res, next) => {
    try {
        let token = req.headers.authorization
        if (!token) {
            return res.status(401).json({ "msg": "Access Denied. Please Login" })
        }
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ "msg": "Invalid or Expired Token" })
            }
            req.user = decoded
            next()
        })
    } catch (err) {
        res.status(401).json({ "msg": "Unauthorized Access" })
    }
}

module.exports = { reguser, login, islogin }
