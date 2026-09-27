import { asyncHandler } from "../utils/asyncHandler.js";
import type { Request, Response } from "express";

const YETOSOL_PLACE_ID = "ChIJk3gxV_v-3BAR6-3kz5kLUIw";
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes — this is a public marketing widget, not live data

let cachedReviews: { rating: number; reviewCount: number; source: string } | null = null;
let cachedAt = 0;

export const getGoogleReviews = asyncHandler(async (req: Request, res: Response) => {
  if (cachedReviews && Date.now() - cachedAt < CACHE_TTL_MS) {
    return res.json(cachedReviews);
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "Google Places API key not configured",
      rating: 5.0,
      reviewCount: 0
    });
  }

  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/details/json?place_id=${YETOSOL_PLACE_ID}&fields=rating,user_ratings_total&key=${apiKey}`
  );

  if (!response.ok) {
    throw new Error(`Google API error: ${response.statusText}`);
  }

  const data = await response.json();

  if (data.status !== "OK") {
    return res.status(500).json({
      error: "Failed to fetch reviews from Google",
      rating: 5.0,
      reviewCount: 0
    });
  }

  const { rating = 5.0, user_ratings_total = 0 } = data.result || {};
  const result = {
    rating: parseFloat(rating.toFixed(1)),
    reviewCount: user_ratings_total || 0,
    source: "google",
  };
  cachedReviews = result;
  cachedAt = Date.now();
  res.json(result);
});