import crypto from "crypto";
import morgan from "morgan";

export const attachRequestId = (req, res, next) => {
    req.id = req.headers["x-request-id"] || crypto.randomUUID();
    res.setHeader("X-Request-Id", req.id);
    next();
};

morgan.token("id", (req) => req.id);

export const requestLogger = morgan(
    ":id :method :url :status :response-time ms"
);