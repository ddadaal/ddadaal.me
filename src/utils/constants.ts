export const WEBSITE_BASE_URL = process.env.NODE_ENV === "production"
  ? "https://ddadaal.me" : `http://localhost:${process.env.PORT || 3000}`;
