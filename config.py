"""Central settings, loaded from environment variables / .env."""
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "sqlite:///./accessml.db"
    # Comma-separated (or JSON list) of allowed frontend origins, no trailing slash.
    cors_origins: str = "http://localhost:5173,https://accessml.vercel.app"

    groq_api_key: str = ""
    GROQ_MODEL="openai/gpt-oss-20b"
    groq_base_url: str = "https://api.groq.com/openai/v1"

    quiz_pass_ratio: float = 0.7
    require_completion_for_certificate: bool = False
    course_title: str = "Supervised Machine Learning & Python Foundations"

    @property
    def cors_origin_list(self) -> list[str]:
        raw = self.cors_origins.strip()
        if raw.startswith("["):
            import json
            items = json.loads(raw)
        else:
            items = raw.split(",")
        return [o.strip().strip('"\'').rstrip("/") for o in items if o.strip()]


settings = Settings()