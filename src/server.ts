import express from "express"
import cors from "cors"
import morgan from "morgan"
import dotenv from "dotenv"
import gameRoutes from "./routes/game.routes.js"
import authenticationRoutes from "./routes/authentication.routes.js"
import cartRoutes from "./routes/cart.routes.js"
import wishlistRoutes from "./routes/wishlist.routes.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000
const RAWG_KEY = process.env.RAWG_API_KEY

app.use(cors())
app.use(morgan("dev"))
app.use(express.json())

app.get("/api/health", (req, res) => {
    res.json({ message: "API is running" })
})


app.use("/api", gameRoutes)
app.use("/api/auth", authenticationRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/wishlist", wishlistRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port`)
})