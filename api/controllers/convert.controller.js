import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MODELS_DIR = path.join(__dirname, "../public/models");
const PYTHON_URL = process.env.PYTHON_SERVICE_URL || "http://localhost:8001";
const API_URL = process.env.API_URL || "http://localhost:8800";

export const convertFloorPlan = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No floor plan image uploaded." });
    }

    // Forward the image to the Python conversion service
    const form = new FormData();
    form.append("file", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    const pythonRes = await axios.post(`${PYTHON_URL}/convert`, form, {
      headers: form.getHeaders(),
      responseType: "arraybuffer",
      timeout: 120_000, // 2 minutes
    });

    // Save the returned .glb file
    if (!fs.existsSync(MODELS_DIR)) {
      fs.mkdirSync(MODELS_DIR, { recursive: true });
    }

    const filename = `${randomUUID()}.glb`;
    const filePath = path.join(MODELS_DIR, filename);
    fs.writeFileSync(filePath, pythonRes.data);

    const modelUrl = `${API_URL}/models/${filename}`;
    return res.status(200).json({ modelUrl });
  } catch (err) {
    // Pass through error from Python service if available
    if (err.response?.data) {
      let errorMsg = "Conversion failed.";
      try {
        const parsed = JSON.parse(Buffer.from(err.response.data).toString());
        errorMsg = parsed.error || errorMsg;
      } catch {
        errorMsg = Buffer.from(err.response.data).toString();
      }
      return res.status(err.response.status || 500).json({ message: errorMsg });
    }

    if (err.code === "ECONNREFUSED" || err.code === "ENOTFOUND") {
      return res.status(503).json({ message: "3D conversion service is not running. Please start the Python service." });
    }

    return res.status(500).json({ message: err.message || "Internal server error" });
  }
};
