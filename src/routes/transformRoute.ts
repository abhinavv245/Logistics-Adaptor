import { Router, Request, Response } from "express";
import { transformController } from "../controllers/transformController";

export const transformRoute = Router();

transformRoute.post("/", (req: Request, res: Response) => {
  const { context } = req.body;

  if (!context || !context.action) {
    return res.status(400).json({ error: "Missing context.action" });
  }

  transformController(req, res);
  
});
