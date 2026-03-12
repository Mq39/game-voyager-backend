import type { Request, Response } from "express"
import { getPopularGames, getHeroGames } from "../services/rawg.service.js"

export const getPopular = async (req: Request, res: Response) => {
    try {
        const games = await getPopularGames()
        res.json(games)
    } catch (e) {
        console.error("Failed to fetch popular games:", e)
        res.status(500).json({ message: "Failed to fetch popular games" })
    }
}

export const getHero = async (req: Request, res: Response) => {
    try {
        const games = await getHeroGames()
        res.json(games)
    } catch (e) {
        console.error('Failed to fetch hero games: ', e)
        res.status(500).json({ message: "Failed to fetch hero games" })
    }
}
