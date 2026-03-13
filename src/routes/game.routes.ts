import { Router } from "express"
import { getHeroGamesC, getPopularGamesC, getGameByIdC, getGameScreenshotsC, getGameMoviesC, searchGamesC } from "../controllers/games.controller.js"

const router = Router()

router.get("/games/search", searchGamesC)
router.get("/games/popular", getPopularGamesC)
router.get("/games/hero", getHeroGamesC)
router.get("/games/:id", getGameByIdC)
router.get("/games/:id/screenshots", getGameScreenshotsC)
router.get("/games/:id/movies", getGameMoviesC)

export default router