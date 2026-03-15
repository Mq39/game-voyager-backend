import { Router } from "express"
import { addToCart, getCart, removeFromCart, updateCartQuantity } from "../controllers/cart.controller.js"
import { authenticate } from "../middleware/authentication.middleware.js"

const router = Router()

router.get("/", authenticate, getCart)
router.post("/", authenticate, addToCart)
router.delete("/:gameId", authenticate, removeFromCart)
router.patch("/:gameId", authenticate, updateCartQuantity)

export default router