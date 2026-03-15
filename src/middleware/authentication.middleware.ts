import type { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"

export interface AuthenticatedRequest extends Request {
    user?: {
        userId: number
    }
}

type JwtUserPayload = {
    userId: number
}

const isJwtUserPayload = (value: unknown): value is JwtUserPayload => {
    return (
        typeof value === "object" &&
        value !== null &&
        "userId" in value &&
        typeof (value as { userId: unknown }).userId === "number"
    )
}

export const authenticate = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization

    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized." })
    }

    const token = authHeader.split(" ")[1]

    if (!token) {
        return res.status(401).json({ message: "Missing token." })
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || "dev_secret"
        )

        if (!isJwtUserPayload(decoded)) {
            return res.status(401).json({ message: "Invalid token payload." })
        }

        req.user = {
            userId: decoded.userId
        }

        next()
    } catch {
        return res.status(401).json({ message: "Invalid token." })
    }
}