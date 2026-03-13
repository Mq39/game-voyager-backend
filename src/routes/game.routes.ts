import { Router } from "express"
import { getHeroGamesC, getPopularGamesC, getGameByIdC, getGameScreenshotsC, getGameMoviesC, searchGamesC, browseGamesC } from "../controllers/games.controller.js"

const router = Router()

router.get("/games/search", searchGamesC)
router.get("/games/browse", browseGamesC)
router.get("/games/popular", getPopularGamesC)
router.get("/games/hero", getHeroGamesC)
router.get("/games/:id/screenshots", getGameScreenshotsC)
router.get("/games/:id/movies", getGameMoviesC)
router.get("/games/:id", getGameByIdC)

export default router