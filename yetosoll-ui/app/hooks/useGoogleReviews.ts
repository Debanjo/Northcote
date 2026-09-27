import { useState, useEffect } from "react";

interface GoogleReviewsData {
  rating: number;
  reviewCount: number;
  source: string;
}

const DEFAULT_REVIEWS: GoogleReviewsData = {
  rating: 5.0,
  reviewCount: 0,
  source: "default",
};

export const useGoogleReviews = () => {
  const [data, setData] = useState<GoogleReviewsData>(DEFAULT_REVIEWS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/reviews/google`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch reviews");
        }

        const result = await response.json();
        setData(result);
      } catch (err: any) {
        setError(err.message);
        setData(DEFAULT_REVIEWS);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
    // Refresh every 60 seconds
    const interval = setInterval(fetchReviews, 60000);
    return () => clearInterval(interval);
  }, []);

  return { data, loading, error };
};
