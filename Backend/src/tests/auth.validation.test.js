import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../app.js";

describe("Auth Validation", () => {
    it("should reject login with invalid email", async () => {
        const response = await request(app)
            .post("/api/v1/users/login")
            .send({
                email: "invalid-email",
                password: "",
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Validation failed");
    });
});