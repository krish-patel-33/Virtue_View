import io
import cv2
import numpy as np
import trimesh
from shapely.geometry import Polygon
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import Response, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Floor Plan to 3D Converter")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

WALL_HEIGHT = 3.0      # metres
SCALE = 0.02           # pixels → metres  (500px image ≈ 10m wide)
MIN_AREA_RATIO = 0.001 # ignore contours smaller than 0.1% of image


def build_3d_from_floor_plan(img_bytes: bytes) -> bytes:
    """Convert a floor plan image to a GLB 3D model."""

    # ── 1. Decode ──────────────────────────────────────────────────────────────
    arr = np.frombuffer(img_bytes, np.uint8)
    img = cv2.imdecode(arr, cv2.IMREAD_GRAYSCALE)
    if img is None:
        raise ValueError("Could not decode image. Please upload a valid PNG/JPG.")

    h, w = img.shape

    # ── 2. Threshold ───────────────────────────────────────────────────────────
    blur = cv2.GaussianBlur(img, (5, 5), 0)
    _, binary = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

    # Ensure walls are WHITE (255) – invert if walls appear dark
    if np.sum(binary == 0) > np.sum(binary == 255):
        binary = cv2.bitwise_not(binary)

    # ── 3. Morphological clean-up ──────────────────────────────────────────────
    kernel = np.ones((3, 3), np.uint8)
    binary = cv2.morphologyEx(binary, cv2.MORPH_CLOSE, kernel, iterations=2)

    # ── 4. Find contours ───────────────────────────────────────────────────────
    contours, _ = cv2.findContours(binary, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_SIMPLE)

    min_area_px = h * w * MIN_AREA_RATIO
    meshes = []

    for contour in contours:
        if cv2.contourArea(contour) < min_area_px:
            continue

        # Simplify contour
        eps = 0.005 * cv2.arcLength(contour, True)
        approx = cv2.approxPolyDP(contour, eps, True)
        if len(approx) < 3:
            continue

        # ── 5. Pixels → metres, flip Y ────────────────────────────────────────
        pts = approx.reshape(-1, 2).astype(float)
        pts[:, 0] *= SCALE
        pts[:, 1] = (h - pts[:, 1]) * SCALE   # flip Y for 3D coords

        try:
            poly = Polygon(pts)
            if not poly.is_valid:
                poly = poly.buffer(0)
            if poly.area < (min_area_px * SCALE * SCALE):
                continue

            # ── 6. Extrude wall ───────────────────────────────────────────────
            mesh = trimesh.creation.extrude_polygon(poly, height=WALL_HEIGHT)
            meshes.append(mesh)
        except Exception as e:
            logger.warning(f"Skipping contour: {e}")
            continue

    if not meshes:
        raise ValueError("No walls detected. Try a clearer floor plan image with visible dark wall lines.")

    # ── 7. Add floor plate ─────────────────────────────────────────────────────
    floor_pts = np.array([[0, 0], [w * SCALE, 0], [w * SCALE, h * SCALE], [0, h * SCALE]])
    try:
        floor_poly = Polygon(floor_pts)
        floor_mesh = trimesh.creation.extrude_polygon(floor_poly, height=0.05)
        floor_mesh.apply_translation([0, 0, -0.05])
        meshes.append(floor_mesh)
    except Exception:
        pass  # floor is optional

    # ── 8. Combine, centre, export ─────────────────────────────────────────────
    combined = trimesh.util.concatenate(meshes)
    combined.apply_translation(-combined.centroid)

    glb = combined.export(file_type="glb")
    logger.info(f"Generated GLB: {len(glb)} bytes from {len(meshes)} meshes")
    return glb


@app.post("/convert")
async def convert_floor_plan(file: UploadFile = File(...)):
    """Accept a floor plan image and return a GLB 3D model."""
    if not file.content_type.startswith("image/"):
        return JSONResponse(status_code=400, content={"error": "File must be an image (PNG, JPG, etc.)"})

    contents = await file.read()
    if len(contents) > 20 * 1024 * 1024:
        return JSONResponse(status_code=400, content={"error": "File too large (max 20MB)"})

    try:
        glb_bytes = build_3d_from_floor_plan(contents)
    except ValueError as e:
        return JSONResponse(status_code=422, content={"error": str(e)})
    except Exception as e:
        logger.error(f"Conversion error: {e}")
        return JSONResponse(status_code=500, content={"error": "Internal conversion error"})

    return Response(
        content=glb_bytes,
        media_type="model/gltf-binary",
        headers={"Content-Disposition": "attachment; filename=model.glb"},
    )


@app.get("/health")
async def health():
    return {"status": "ok"}
