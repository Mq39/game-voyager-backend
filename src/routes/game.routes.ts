import { Router } from "express"
import { getHero, getPopular } from "../controllers/games.controller.js"

const router = Router()

router.get("/games/popular", getPopular)
router.get("/games/hero", getHero)

export default router