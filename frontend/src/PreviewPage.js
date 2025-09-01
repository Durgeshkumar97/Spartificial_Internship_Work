// src/PreviewPage.js
import React, { useEffect, useMemo, useState } from "react";
import "./App.css";

export default function PreviewPage() {
  const [rows, setRows] = useState([]);
  const [cols, setCols] = useState([]);

  useEffect(() => {
    try {
      const r = JSON.parse(sessionStorage.getItem("previewRows") || "[]");
      const c = JSON.parse(sessionStorage.getItem("previewCols") || "[]");
      setRows(r);
      setCols(c.length ? c : (r.length ? Object.keys(r[0]) : []));
    } catch {
      setRows([]);
      setCols([]);
    }
  }, []);

  const name = useMemo(() => sessionStorage.getItem("predictionsName") || "predictions.xlsx", []);

  if (!rows.length) {
    return (
      <div className="container">
        <div className="card">
          <h1 className="title">Preview Predictions</h1>
          <p className="error">No preview data available. Please upload a file first.</p>
          <a href="/" className="download-link" style={{ marginTop: "1rem", display: "inline-block" }}>
            ⬅ Back to Upload
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">Preview: {name}</h1>

        <div style={{ display: "flex", gap: 12, marginBottom: 12, justifyContent: "flex-end" }}>
          <a href="/" className="download-link">⬅ Back</a>
          <a
            href={sessionStorage.getItem("predictionsBlobURL") || "#"}
            download={name}
            className="download-link"
          >
            ⬇ Download Excel
          </a>
        </div>

        <div style={{ overflow: "auto", maxHeight: "70vh", borderRadius: 12, border: "1px solid rgba(255,255,255,.18)" }}>
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr>
                {cols.map((c) => (
                  <th key={c} style={{ position: "sticky", top: 0, background: "rgba(0,0,0,.5)", padding: 8, textAlign: "left", borderBottom: "1px solid rgba(255,255,255,.18)" }}>
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} style={{ background: i % 2 ? "rgba(255,255,255,.04)" : "transparent" }}>
                  {cols.map((c) => (
                    <td key={c} style={{ padding: 8, borderBottom: "1px solid rgba(255,255,255,.12)", whiteSpace: "nowrap" }}>
                      {String(row[c])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
