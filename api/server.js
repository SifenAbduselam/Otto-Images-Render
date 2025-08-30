import express from "express";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());

// Configure Cloudinary
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Route to fetch images from any folder
app.get("/images/:folder", async (req, res) => {
  const folder = req.params.folder;
  console.log("Fetching folder:", folder);

  try {
    const resources = await cloudinary.search
      .expression(`folder:${folder}/*`)
      .sort_by("public_id", "asc")
      .max_results(100)
      .execute();

    const urls = resources.resources.map((r) => r.secure_url);
    res.json(urls);
  } catch (err) {
    console.error("Cloudinary error:", err);
    res.status(500).json({ error: "Failed to fetch images" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
