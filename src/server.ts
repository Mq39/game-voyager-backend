import express from "express"
import cors from "cors"
import morgan from "morgan"
import dotenv from "dotenv"
import swaggerUi from "swagger-ui-express"
import YAML from "yamljs"


import gameRoutes from "./routes/game.routes.js"
import authenticationRoutes from "./routes/authentication.routes.js"
import cartRoutes from "./routes/cart.routes.js"
import wishlistRoutes from "./routes/wishlist.routes.js"

dotenv.config()

const app = express()
const swaggerDocument = YAML.load("openapi.yaml")

app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://game-voyager.vercel.app"
    ],
    credentials: true
}))
app.use(morgan("dev"))
app.use(express.json())

app.get("/api/health", (_req, res) => {
    res.json({ message: "API is running" })
})

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use("/api", gameRoutes)
app.use("/api/auth", authenticationRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/wishlist", wishlistRoutes)

export default app