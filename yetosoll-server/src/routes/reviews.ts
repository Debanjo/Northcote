import express from "express";
import { getGoogleReviews } from "../controllers/reviews.js";

const reviewsRouter = express.Router();

reviewsRouter.get("/google", getGoogleReviews);

export default reviewsRouter;
