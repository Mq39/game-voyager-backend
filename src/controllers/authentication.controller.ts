import type { Request, Response } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { db } from "../resources/db.js"
import type { RowDataPacket, ResultSetHeader } from "mysql2"

type UserRow = RowDataPacket & {
    id: number
    username: string
    email: string
    password_hash: string
    is_active: number
}

export const register = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body

        if (!username || !email || !password) {
            return res.status(400).json({ message: "Missing required fields." })
        }

        const [existingUsers] = await db.query<UserRow[]>(
            "SELECT id FROM users WHERE username = ? OR email = ? LIMIT 1",
            [username, email]
        )

        if (existingUsers.length > 0) {
            return res.status(409).json({ message: "Username or email already exists." })
        }

        const passwordHash = await bcrypt.hash(password, 10)

        const [result] = await db.execute<ResultSetHeader>(
            `
            INSERT INTO users (username, email, password_hash)
            VALUES (?, ?, ?)
            `,
            [username, email, passwordHash]
        )

        const user = {
            id: result.insertId,
            username,
            email
        }

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET || "dev_secret",
            { expiresIn: "7d" }
        )

        return res.status(201).json({
            token,
            user
        })
    } catch (error) {
        console.error("Register error:", error)
        return res.status(500).json({ message: "Failed to register user." })
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const username = req.body.username?.trim()
        const password = req.body.password

        console.log("LOGIN BODY:", req.body)
        console.log("USERNAME RAW:", JSON.stringify(username))

        if (!username || !password) {
            return res.status(400).json({ message: "Missing credentials." })
        }

        const [rows] = await db.query<UserRow[]>(
            `
            SELECT id, username, email, password_hash, is_active
            FROM users
            WHERE username = ?
            LIMIT 1
            `,
            [username]
        )

        console.log("ROWS LENGTH:", rows.length)

        const user = rows[0]

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials." })
        }

        console.log("USER FOUND:", {
            id: user.id,
            username: user.username,
            email: user.email,
            is_active: user.is_active,
            hashPreview: user.password_hash?.slice(0, 20)
        })

        if (!user.is_active) {
            return res.status(403).json({ message: "Account is inactive." })
        }

        const isValidPassword = await bcrypt.compare(password, user.password_hash)
        console.log("PASSWORD MATCH:", isValidPassword)

        if (!isValidPassword) {
            return res.status(401).json({ message: "Invalid credentials." })
        }

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET || "dev_secret",
            { expiresIn: "7d" }
        )

        return res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        })
    } catch (error) {
        console.error("Login error:", error)
        return res.status(500).json({ message: "Failed to login." })
    }
}