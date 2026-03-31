import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MODELS_DIR = path.join(__dirname, "../public/models");
const API_URL = process.env.API_URL || "http://localhost:8800";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// =====================================================
// GEMINI PROMPT FOR 3D MODEL GENERATION
// you can change your custom prompt below:
// =====================================================
const FLOOR_PLAN_TO_3D_PROMPT = `
Transform this architectural floor plan into a photorealistic top-down render in the distinct visual style of Wes Anderson.

Important: Preserve all room labels and text exactly as shown.

## Style & aesthetic

- Meticulously designed film-set / diorama feel
- Hyper-symmetrical composition
- Flat, centered perspective
- Slight bird’s-eye, orthographic top-down view
- Everything feels deliberate, twee, and theatrically precise.

## Color palette (muted, dusty)

- Walls: warm ivory, chalky bone white, or soft blush pink
- Floors (by room function):
    - Bedroom: dusty rose
    - Kitchen: pale mint
    - Living area: warm sand
    - Bathroom: powder blue
    - Alternative options: warm terracotta / faded mustard / sage green
- Furniture & decor accents: rust orange, burgundy, forest green, golden rod, faded teal
- Shadows: soft + diffused (never harsh), with warm sepia undertones

## Lighting

- Even, warm, golden-hour interior lighting
- No strong contrast
- Flat ambient glow with subtle depth (like a dollhouse lit from above)

## Furniture & decor

Populate each room with era-ambiguous furniture (1960s–70s mid-century with European touches).

Include:

- Patterned rugs (geometric or floral motifs)
- Small decorative objects placed symmetrically (books, potted plants, vintage lamps)
- Wood-paneled or wallpapered walls with subtle texture

Avoid:

- Modern tech / modern screens visible
`;
// =====================================================

export const convertFloorPlan = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No floor plan image uploaded." });
    }

    if (!GEMINI_API_KEY || GEMINI_API_KEY === "your_gemini_api_key_here") {
      return res.status(500).json({ 
        message: "Gemini API key not configured. Please set GEMINI_API_KEY in .env file." 
      });
    }

    // Convert image to base64
    const imageBase64 = req.file.buffer.toString("base64");
    const mimeType = req.file.mimetype;

    // Call Gemini API for floor plan analysis and 3D generation
    // Using gemini-2.0-flash-exp (has free tier access)
    const geminiResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: FLOOR_PLAN_TO_3D_PROMPT
              },
              {
                inline_data: {
                  mime_type: mimeType,
                  data: imageBase64
                }
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 8192,
        }
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 120_000, // 2 minutes
      }
    );

    // Extract the response
    const geminiResult = geminiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!geminiResult) {
      return res.status(500).json({ message: "Failed to get response from Gemini API." });
    }

    // Create models directory if it doesn't exist
    if (!fs.existsSync(MODELS_DIR)) {
      fs.mkdirSync(MODELS_DIR, { recursive: true });
    }

    // Save the analysis result as JSON (this can be used to generate 3D model on frontend)
    const filename = `${randomUUID()}.json`;
    const filePath = path.join(MODELS_DIR, filename);
    
    const modelData = {
      analysis: geminiResult,
      originalImage: `data:${mimeType};base64,${imageBase64}`,
      createdAt: new Date().toISOString(),
    };
    
    fs.writeFileSync(filePath, JSON.stringify(modelData, null, 2));

    const modelUrl = `${API_URL}/models/${filename}`;
    return res.status(200).json({ 
      modelUrl,
      analysis: geminiResult 
    });

  } catch (err) {
    console.error("Gemini API Error:", err.response?.data || err.message);
    
    // Handle Gemini API specific errors
    if (err.response?.data?.error) {
      const geminiError = err.response.data.error;
      return res.status(err.response.status || 500).json({ 
        message: geminiError.message || "Gemini API error" 
      });
    }
    
    if (err.response?.status === 400) {
      return res.status(400).json({ message: "Invalid image format or request." });
    }
    
    if (err.response?.status === 403) {
      return res.status(403).json({ message: "Gemini API key is invalid or has insufficient permissions." });
    }
    
    if (err.response?.status === 429) {
      return res.status(429).json({ message: "Rate limit exceeded. Please try again later." });
    }
    
    if (err.response?.status === 404) {
      return res.status(404).json({ message: "Gemini model not found. The API key may not have access to this model." });
    }

    return res.status(500).json({ message: err.message || "Internal server error" });
  }
};
