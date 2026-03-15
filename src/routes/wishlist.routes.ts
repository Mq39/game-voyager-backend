import { Router } from "express"
import { getWishlist, addToWishlist, removeFromWishlist } from "../controllers/wishlist.controller.js"
import { authenticate } from "../middleware/authentication.middleware.js"

const router = Router()

router.get("/", authenticate, getWishlist)
router.post("/", authenticate, addToWishlist)
router.delete("/:gameId", authenticate, removeFromWishlist)

export default router