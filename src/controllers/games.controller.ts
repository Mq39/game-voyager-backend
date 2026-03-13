import type { Request, Response } from "express"
import { getPopularGames, getHeroGames, getGameById, getGameScreenshots, getGameMovies, searchGames, browseGames, type BrowseGamesOptions } from "../services/rawg.service.js"

export const getPopularGamesC = async (req: Request, res: Response) => {
    try {
        const games = await getPopularGames()
        res.json(games)
    } catch (e) {
        console.error("Failed to fetch popular games:", e)
        res.status(500).json({ message: "Failed to fetch popular games" })
    }
}

export const getHeroGamesC = async (req: Request, res: Response) => {
    try {
        const games = await getHeroGames()
        res.json(games)
    } catch (e) {
        console.error('Failed to fetch hero games: ', e)
        res.status(500).json({ message: "Failed to fetch hero games" })
    }
}

export const getGameByIdC = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string
        console.log("GAME ID: ", id)

        const game = await getGameById(id)
        res.json(game)
    } catch (e) {
        console.error("Failed to fetch game:", e)
        res.status(500).json({ message: "Failed to fetch game" })
    }


}

export const getGameScreenshotsC = async (req: Request, res: Response) => {
    try {
        const id = req.params.id

        if (!id || Array.isArray(id)) {
            return res.status(400).json({ message: "Invalid game id" })
        }

        const screenshots = await getGameScreenshots(id)
        res.json(screenshots)
    } catch (e) {
        console.error("Failed to fetch screenshots:", e)
        res.status(500).json({ message: "Failed to fetch screenshots" })
    }
}

export const getGameMoviesC = async (req: Request, res: Response) => {
    try {
        const id = req.params.id

        if (!id || Array.isArray(id)) {
            return res.status(400).json({ message: "Invalid game id" })
        }

        const movies = await getGameMovies(id)
        res.json(movies)
    } catch (e) {
        console.error("Failed to fetch game movies:", e)
        res.status(500).json({ message: "Failed to fetch game movies" })
    }
}

export const searchGamesC = async (req: Request, res: Response) => {
    try {
        const query = String(req.query.query || "").trim()
        const pageSize = Number(req.query.pageSize || 6)

        if (!query) {
            return res.json([])
        }

        const games = await searchGames(query, pageSize)
        res.json(games)
    } catch (e) {
        console.error("Failed to search games:", e)
        res.status(500).json({ message: "Failed to search games" })
    }
}

export const browseGamesC = async (req: Request, res: Response) => {
    try {
        const search = typeof req.query.search === "string" ? req.query.search : undefined
        const genres = typeof req.query.genre === "string" ? req.query.genre : undefined
        const platforms = typeof req.query.platform === "string" ? req.query.platform : undefined
        const ordering = typeof req.query.ordering === "string" ? req.query.ordering : undefined

        const rawPage = Number(req.query.page)
        const rawPageSize = Number(req.query.pageSize)

        const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1
        const pageSize = Number.isFinite(rawPageSize) && rawPageSize > 0 ? rawPageSize : 20

        const options: BrowseGamesOptions = {
            page,
            pageSize
        }

        if (search) {
            options.search = search
        }

        if (genres) {
            options.genres = genres
        }

        if (platforms) {
            options.platforms = platforms
        }

        if (ordering) {
            options.ordering = ordering
        }

        const games = await browseGames(options)

        res.json(games)
    } catch (e) {
        console.error("Failed to browse games:", e)
        res.status(500).json({ message: "Failed to browse games" })
    }
}