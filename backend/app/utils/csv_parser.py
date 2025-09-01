# app/utils/csv_parser.py
from fastapi import UploadFile, HTTPException
import pandas as pd
from io import StringIO, BytesIO

def _is_xlsx(b: bytes) -> bool:
    return b[:4] == b"PK\x03\x04"

async def parse_uploaded_csv(file: UploadFile) -> pd.DataFrame:
    raw = await file.read()
    if not raw:
        raise HTTPException(400, "Uploaded file is empty.")

    # Accept Excel
    if _is_xlsx(raw):
        try:
            return pd.read_excel(BytesIO(raw))
        except Exception as e:
            raise HTTPException(400, f"Error parsing Excel: {e}")

    # ✅ Simply let pandas handle quoting, BOMs, commas
    for enc in ("utf-8", "utf-8-sig", "latin-1", "cp1252"):
        try:
            text = raw.decode(enc, errors="ignore")
            df = pd.read_csv(StringIO(text))
            if not df.empty:
                return df
        except Exception:
            continue

    raise HTTPException(400, "Error parsing CSV: could not read with pandas.")
