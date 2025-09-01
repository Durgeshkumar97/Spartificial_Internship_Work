import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import router as api_router
from app.models import model_loader

logging.basicConfig(level=logging.INFO)
app = FastAPI(title="RNN Prediction API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    model_loader.load_rnn_model()

app.include_router(api_router)

@app.get("/")
async def root():
    return {"message": "Welcome to the RNN Prediction API!"}
