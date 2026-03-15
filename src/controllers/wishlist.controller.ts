import type { Response } from "express"
import { db } from "../resources/db.js"
import type { RowDataPacket, ResultSetHeader } from "mysql2"
import type { AuthenticatedRequest } from "../middleware/authentication.middleware.js"

type WishlistItemRow = RowDataPacket & {
    id: number
    gameId: number
    title: string
    image: string | null
}

type GameRow = RowDataPacket & {
    id: number
    rawg_id: number
    title: string
    image: string | null
}

export const getWishlist = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.userId

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized." })
        }

        const [rows] = await db.query<WishlistItemRow[]>(
            `
            SELECT
                wi.id,
                g.rawg_id AS gameId,
                g.title,
                g.image
            FROM wishlist_items wi
            INNER JOIN games g ON g.id = wi.game_id
            WHERE wi.user_id = ?
            ORDER BY wi.created_at DESC
            `,
            [userId]
        )

        return res.json({
            items: rows
        })
    } catch (error) {
        console.error("Get wishlist error:", error)
        return res.status(500).json({ message: "Failed to load wishlist." })
    }
}

export const addToWishlist = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.userId
        const { gameId, title, image } = req.body

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized." })
        }

        if (!gameId || !title) {
            return res.status(400).json({ message: "gameId and title are required." })
        }

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
            INSERT IGNORE INTO wishlist_items (user_id, game_id)
            VALUES (?, ?)
            `,
            [userId, localGameId]
        )

        return res.status(201).json({ message: "Added to wishlist." })
    } catch (error) {
        console.error("Add to wishlist error:", error)
        return res.status(500).json({ message: "Failed to add to wishlist." })
    }
}

export const removeFromWishlist = async (req: AuthenticatedRequest, res: Response) => {
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
            DELETE wi
            FROM wishlist_items wi
            INNER JOIN games g ON g.id = wi.game_id
            WHERE wi.user_id = ? AND g.rawg_id = ?
            `,
            [userId, rawgGameId]
        )

        return res.json({ message: "Removed from wishlist." })
    } catch (error) {
        console.error("Remove from wishlist error:", error)
        return res.status(500).json({ message: "Failed to remove from wishlist." })
    }
}