import type { Response } from "express"
import type { ResultSetHeader, RowDataPacket } from "mysql2"
import { db } from "../resources/db.js"
import type { AuthenticatedRequest } from "../middleware/authentication.middleware.js"

type CartItemRow = RowDataPacket & {
    id: number
    gameId: number
    title: string
    image: string | null
    quantity: number
}

type GameRow = RowDataPacket & {
    id: number
    rawg_id: number
    title: string
    image: string | null
}

export const getCart = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.userId

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized." })
        }

        const [rows] = await db.query<CartItemRow[]>(
            `
            SELECT
                ci.id,
                g.rawg_id AS gameId,
                g.title,
                g.image,
                ci.quantity
            FROM cart_items ci
            INNER JOIN games g ON g.id = ci.game_id
            WHERE ci.user_id = ?
            ORDER BY ci.created_at DESC
            `,
            [userId]
        )

        return res.json({
            items: rows
        })
    } catch (error) {
        console.error("Get cart error:", error)
        return res.status(500).json({ message: "Failed to load cart." })
    }
}

export const addToCart = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.userId
        const { gameId, quantity, title, image } = req.body

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized." })
        }

        if (!gameId) {
            return res.status(400).json({ message: "gameId is required." })
        }

        const safeQuantity =
            typeof quantity === "number" && quantity > 0 ? quantity : 1

        const [games] = await db.query<GameRow[]>(
            `
            SELECT id, rawg_id, title, image
            FROM games
            WHERE rawg_id = ?
            LIMIT 1
            `,
            [gameId]
        )

        let localGameId: number

        if (games.length > 0) {
            localGameId = games[0]!.id
        } else {
            if (!title) {
                return res.status(400).json({
                    message: "title is required when the game is not in the local database."
                })
            }

            const [insertResult] = await db.execute<ResultSetHeader>(
                `
                INSERT INTO games (rawg_id, title, image)
                VALUES (?, ?, ?)
                `,
                [gameId, title, image ?? null]
            )

            localGameId = insertResult.insertId
        }

        await db.execute<ResultSetHeader>(
            `
            INSERT INTO cart_items (user_id, game_id, quantity)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)
            `,
            [userId, localGameId, safeQuantity]
        )

        return res.status(201).json({
            message: "Added to cart."
        })
    } catch (error) {
        console.error("Add to cart error:", error)
        return res.status(500).json({ message: "Failed to add to cart." })
    }
}

export const removeFromCart = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.userId
        const rawgGameId = Number(req.params.gameId)

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized." })
        }

        if (!rawgGameId) {
            return res.status(400).json({ message: "Invalid gameId." })
        }

        await db.execute<ResultSetHeader>(
            `
            DELETE ci
            FROM cart_items ci
            INNER JOIN games g ON g.id = ci.game_id
            WHERE ci.user_id = ? AND g.rawg_id = ?
            `,
            [userId, rawgGameId]
        )

        return res.json({
            message: `Removed game ${rawgGameId} from cart.`
        })
    } catch (error) {
        console.error("Remove from cart error:", error)
        return res.status(500).json({ message: "Failed to remove from cart." })
    }
}

export const updateCartQuantity = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.userId
        const rawgGameId = Number(req.params.gameId)
        const { quantity } = req.body

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized." })
        }

        if (!rawgGameId || typeof quantity !== "number") {
            return res.status(400).json({ message: "Invalid request." })
        }

        if (quantity <= 0) {
            await db.execute<ResultSetHeader>(
                `
                DELETE ci
                FROM cart_items ci
                INNER JOIN games g ON g.id = ci.game_id
                WHERE ci.user_id = ? AND g.rawg_id = ?
                `,
                [userId, rawgGameId]
            )

            return res.json({ message: "Item removed." })
        }

        await db.execute<ResultSetHeader>(
            `
            UPDATE cart_items ci
            INNER JOIN games g ON g.id = ci.game_id
            SET ci.quantity = ?
            WHERE ci.user_id = ? AND g.rawg_id = ?
            `,
            [quantity, userId, rawgGameId]
        )

        return res.json({ message: "Quantity updated." })

    } catch (error) {
        console.error("Update quantity error:", error)
        return res.status(500).json({ message: "Failed to update quantity." })
    }
}