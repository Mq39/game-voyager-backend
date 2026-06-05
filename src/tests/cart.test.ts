/**
 * T-CART-7: Bez tokena svi cart endpoint-i vraćaju 401.
 */

import request from "supertest"
import { describe, it, expect } from "vitest"
import app from "../server.js"

describe("Cart endpoints", () => {
    it("GET /api/cart bez tokena vraća 401", async () => {
        const response = await request(app).get("/api/cart")

        expect(response.status).toBe(401)
    })
})