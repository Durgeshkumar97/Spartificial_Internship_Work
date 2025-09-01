from fastapi import HTTPException
import pandas as pd

def validate_input_dataframe(df: pd.DataFrame, required_columns=None) -> bool:
    if df is None or df.empty:
        raise HTTPException(status_code=400, detail="Uploaded CSV is empty or invalid.")

    # If a strict schema is supplied, enforce it; otherwise just check no NaNs
    if required_columns:
        missing = [c for c in required_columns if c not in df.columns]
        if missing:
            raise HTTPException(status_code=400, detail=f"Missing required columns: {missing}")

    if df.isnull().values.any():
        raise HTTPException(status_code=400, detail="Input contains missing values. Please clean your CSV.")

    # Minimal shape: 1 label column + at least 1 feature column
    if df.shape[1] < 2:
        raise HTTPException(status_code=400, detail="CSV must have a label column and at least one feature column.")

    return True
