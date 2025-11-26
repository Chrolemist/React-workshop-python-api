import yaml
from main import app
from fastapi.openapi.utils import get_openapi

# Hämta OpenAPI-schemat (JSON-format) från vår app
openapi_schema = get_openapi(
    title=app.title,
    version=app.version,
    routes=app.routes,
)

# Spara det som en YAML-fil
with open("openapi.yaml", "w") as f:
    yaml.dump(openapi_schema, f, sort_keys=False)

print("✅ openapi.yaml har skapats! Detta är nu ditt kontrakt.")