import cloudinary
import cloudinary.uploader
from fastapi import UploadFile

from app.config import get_settings

settings = get_settings()

# Configure cloudinary
if settings.cloudinary_cloud_name:
    cloudinary.config(
        cloud_name=settings.cloudinary_cloud_name,
        api_key=settings.cloudinary_api_key,
        api_secret=settings.cloudinary_api_secret,
        secure=True,
    )


async def upload_image(file: UploadFile, folder: str = "dmx") -> str:
    """Upload an image to Cloudinary and return the secure URL."""
    contents = await file.read()
    
    result = cloudinary.uploader.upload(
        contents,
        folder=folder,
        resource_type="image",
        transformation=[
            {"quality": "auto", "fetch_format": "auto"},
        ],
    )
    
    return result["secure_url"]


async def delete_image(public_id: str) -> bool:
    """Delete an image from Cloudinary."""
    result = cloudinary.uploader.destroy(public_id)
    return result.get("result") == "ok"
