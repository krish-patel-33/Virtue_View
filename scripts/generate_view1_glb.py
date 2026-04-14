from __future__ import annotations

import argparse
from pathlib import Path

import numpy as np
import trimesh
from PIL import Image, ImageFilter
from trimesh.visual.material import PBRMaterial
from trimesh.visual.texture import TextureVisuals


DEFAULT_INPUT = Path(r"c:\Users\krish\Downloads\floorr_plan.png")
DEFAULT_OUTPUT = Path(r"c:\kernal\MCA\project\VirtueView_r\client\public\view1.glb")
DEFAULT_TEXTURE = Path(r"c:\kernal\MCA\project\VirtueView_r\client\public\view1_texture.png")


def build_texture(image: Image.Image, target_width: int) -> Image.Image:
    image = image.convert("RGB")
    aspect_ratio = image.width / image.height
    target_height = int(target_width / aspect_ratio)

    arr = np.asarray(image).astype(np.float32) / 255.0

    # Soft Wes-inspired grade: warmer highlights, slightly muted contrast,
    # gentle sepia and a soft glow to keep the diorama feel.
    arr = np.clip((arr - 0.5) * 0.9 + 0.5, 0.0, 1.0)
    arr[..., 0] = np.clip(arr[..., 0] * 1.05 + 0.02, 0.0, 1.0)
    arr[..., 1] = np.clip(arr[..., 1] * 1.0 + 0.01, 0.0, 1.0)
    arr[..., 2] = np.clip(arr[..., 2] * 0.93, 0.0, 1.0)

    soft_focus = Image.fromarray((arr * 255).astype(np.uint8))
    soft_focus = soft_focus.filter(ImageFilter.GaussianBlur(radius=0.7))
    softened = Image.blend(Image.fromarray((arr * 255).astype(np.uint8)), soft_focus, 0.18)

    return softened.resize((target_width, target_height), Image.Resampling.LANCZOS)


def make_textured_scene(texture: Image.Image) -> trimesh.Scene:
    aspect_ratio = texture.width / texture.height
    width = 15.0
    height = width / aspect_ratio
    thickness = 0.12

    base = trimesh.creation.box(extents=[width, height, thickness])
    base.visual.face_colors = [229, 219, 204, 255]

    z = thickness / 2 + 0.001
    vertices = np.array(
        [
            [-width / 2, -height / 2, z],
            [width / 2, -height / 2, z],
            [width / 2, height / 2, z],
            [-width / 2, height / 2, z],
        ],
        dtype=float,
    )
    faces = np.array([[0, 1, 2], [0, 2, 3]])
    uv = np.array([[0, 1], [1, 1], [1, 0], [0, 0]], dtype=float)

    material = PBRMaterial(
        name="view1_texture",
        baseColorTexture=texture,
        metallicFactor=0.0,
        roughnessFactor=0.98,
    )
    top = trimesh.Trimesh(
        vertices=vertices,
        faces=faces,
        visual=TextureVisuals(uv=uv, material=material),
        process=False,
    )

    scene = trimesh.Scene()
    scene.add_geometry(base, node_name="base")
    scene.add_geometry(top, node_name="top_texture")
    return scene


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate a textured GLB from a top-down floor plan render.")
    parser.add_argument("--input", type=Path, default=DEFAULT_INPUT)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--texture", type=Path, default=DEFAULT_TEXTURE)
    parser.add_argument("--width", type=int, default=4096, help="Output texture width before embedding.")
    args = parser.parse_args()

    if not args.input.exists():
        raise FileNotFoundError(f"Input image not found: {args.input}")

    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.texture.parent.mkdir(parents=True, exist_ok=True)

    source = Image.open(args.input)
    texture = build_texture(source, target_width=args.width)
    texture.save(args.texture)

    scene = make_textured_scene(texture)
    args.output.write_bytes(scene.export(file_type="glb"))

    size_mb = args.output.stat().st_size / (1024 * 1024)
    print(f"Generated {args.output} ({size_mb:.2f} MB)")
    print(f"Saved preview texture to {args.texture}")


if __name__ == "__main__":
    main()
