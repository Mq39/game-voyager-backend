import request from "supertest"
import { describe, it, expect } from "vitest"
import app from "../server.js"

describe("Health endpoint", () => {
    it("GET /api/health vraća status 200", async () => {
        const response = await request(app).get("/api/health")

        expect(response.status).toBe(200)
    })
})