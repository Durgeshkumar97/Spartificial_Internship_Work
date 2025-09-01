import traceback
from io import BytesIO
import numpy as np
import pandas as pd
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse, StreamingResponse
from sklearn.metrics import confusion_matrix

from app.models import model_loader
from app.utils.csv_parser import parse_uploaded_csv
from app.utils.data_validator import validate_input_dataframe
from app.config.constants import REQUIRED_COLUMNS, THRESHOLD, PREDICTION_OUTPUT_NAME

router = APIRouter()

@router.post(
    "/predict",
    responses={
        200: {
            "content": {
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {}
            },
            "description": "Excel file with predictions",
        }
    },
)
async def predict_endpoint(file: UploadFile = File(...)):
    try:
        # Parse & validate
        df = await parse_uploaded_csv(file)
        validate_input_dataframe(df, required_columns=REQUIRED_COLUMNS)

        # First col = labels, rest = features
        y = df.iloc[:, 0].to_numpy()
        X = df.iloc[:, 1:].to_numpy()

        # If labels are 1/2, shift -> 0/1
        if np.min(y) == 1:
            y = y - 1

        # Ensure numeric features
        if not np.issubdtype(X.dtype, np.number):
            raise HTTPException(status_code=400, detail="All feature columns must be numeric.")

        # Model
        model = model_loader.model
        if model is None:
            raise HTTPException(status_code=500, detail="Model is not loaded.")

        # RNN expects (batch, timesteps, channels)
        X = X.reshape((X.shape[0], X.shape[1], 1))

        # Predict
        y_prob = model.predict(X).reshape(-1)
        y_pred = (y_prob > float(THRESHOLD)).astype(int)

        # Optional CM (not returned, just for debug)
        try:
            _ = confusion_matrix(y.astype(int), y_pred.astype(int))
        except Exception:
            pass

        # Build output DataFrame
        df_out = df.copy()
        df_out.insert(0, "Direction", np.where(y_pred == 1, "True", "False"))
        # Format probability to 2 decimal places
        df_out.insert(1, "Probability (%)", [f"{p*100:.2f}" for p in y_prob])

        # Excel stream
        buf = BytesIO()
        with pd.ExcelWriter(buf, engine="openpyxl") as writer:
            df_out.to_excel(writer, index=False)
        buf.seek(0)

        filename = PREDICTION_OUTPUT_NAME if PREDICTION_OUTPUT_NAME.endswith(".xlsx") else "predictions.xlsx"
        return StreamingResponse(
            buf,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": f'attachment; filename="{filename}"'}
        )

    except HTTPException as e:
        return JSONResponse(status_code=e.status_code, content={"error": e.detail})
    except Exception as e:
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"error": str(e)})
