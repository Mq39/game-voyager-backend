import request from "supertest"
import { describe, it, expect } from "vitest"
import app from "../server.js"

describe("Games endpoints", () => {
    it("GET /api/games/search bez query parametra vraća prazan niz", async () => {
        const response = await request(app).get("/api/games/search")

        expect(response.status).toBe(200)
        expect(response.body).toEqual([])
    })
})