from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    database_url: str = "postgresql+asyncpg://dmx:dmx_dev_2026@localhost:5432/dmx_db"
    secret_key: str = "dmx-dev-secret-key-change-in-production"
    cors_origins: str = "http://localhost:3000"
    debug: bool = True

    # JWT
    access_token_expire_minutes: int = 60 * 24  # 24 hours

    # Admin
    admin_username: str = "admin"
    admin_password_hash: str = "$2b$12$LJ3mFz2yjR4GKv.Q4qX7IOx5DFx.y7Js9Kq1WcHfZ7.KZ7ZjZ7Zq"  # default: "dmx@admin2026"

    # Cloudinary
    cloudinary_cloud_name: str = ""
    cloudinary_api_key: str = ""
    cloudinary_api_secret: str = ""

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",")]


@lru_cache
def get_settings() -> Settings:
    return Settings()
