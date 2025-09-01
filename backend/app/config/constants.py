from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = BASE_DIR / "models" / "weights" / "RNN_15-4.h5"

# Your CSV schema is LABEL + many FLUX.* columns, so skip strict column checks
REQUIRED_COLUMNS = None

THRESHOLD = 0.5
PREDICTION_OUTPUT_NAME = "predictions.xlsx"
