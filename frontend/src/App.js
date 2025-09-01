// src/App.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_BASE = process.env.REACT_APP_API_BASE || "http://127.0.0.1:8000";
const MAX_MB = 50;
const ACCEPTED_EXT = [".csv", ".xlsx", ".xls"];

function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [downloadLink, setDownloadLink] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // cleanup object URLs
  useEffect(() => {
    return () => {
      if (downloadLink) URL.revokeObjectURL(downloadLink);
    };
  }, [downloadLink]);

  const validateFile = (f) => {
    if (!f) throw new Error("Please select a file.");
    const ext = `.${(f.name.split(".").pop() || "").toLowerCase()}`;
    if (!ACCEPTED_EXT.includes(ext)) throw new Error("Allowed types: .csv, .xlsx");
    if (f.size > MAX_MB * 1024 * 1024) throw new Error(`File must be ≤ ${MAX_MB} MB`);
  };

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    setError("");
    if (downloadLink) {
      URL.revokeObjectURL(downloadLink);
      setDownloadLink(null);
    }
    try {
      validateFile(f);
      setFile(f);
    } catch (err) {
      setFile(null);
      setError(err.message || "Invalid file.");
    }
  };

  const getServerFilename = (cd) => {
    if (!cd) return null;
    const m = /filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i.exec(cd);
    return decodeURIComponent((m?.[1] || m?.[2] || "").trim());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (downloadLink) {
      URL.revokeObjectURL(downloadLink);
      setDownloadLink(null);
    }

    try {
      validateFile(file);
    } catch (err) {
      setError(err.message);
      return;
    }

    setLoading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(`${API_BASE}/predict`, formData, {
        responseType: "blob",
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (evt) => {
          if (evt.total) setUploadProgress(Math.round((evt.loaded * 100) / evt.total));
        },
      });

      const serverName = getServerFilename(res.headers["content-disposition"]);
      const name = serverName || "predictions.xlsx";
      const blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      setDownloadLink(url);

    } catch (err) {
      if (err?.response?.data instanceof Blob) {
        const txt = await err.response.data.text();
        try {
          const j = JSON.parse(txt);
          setError(j.error || txt);
        } catch {
          setError(txt || "Server error");
        }
      } else {
        setError(err.message || "Upload failed");
      }
    } finally {
      setLoading(false);
    }
  };

  // contributors with LinkedIn
  const teamMembers = [
    { name: "Ahamika Pattnaik", linkedin: "https://www.linkedin.com/in/ahamikapattnaik/" },
    { name: "Durgesh Duklan", linkedin: "https://www.linkedin.com/in/durgeshkumar3/" },
    { name: "Sukant Neve", linkedin: "https://www.linkedin.com/in/sukant-neve/" },
    { name: "Zainul Panjwani", linkedin: "https://www.linkedin.com/in/zainul-panjwani-920aa9160/" },
  ];

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">Exoplanet Prediction App</h1>
        <p className="subtitle" style={{ maxWidth: 600, margin: "0 auto var(--spacing-medium)" }}>
          An AI-powered tool to detect exoplanets using RNN sequence models on stellar flux data.
          Built during a research internship at <strong>Spartificial Innovations Pvt. Ltd.</strong>
        </p>

        <form onSubmit={handleSubmit} className="form" aria-busy={loading}>
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileChange}
            className="file-input"
            aria-label="Upload CSV or Excel file"
          />
          <button type="submit" disabled={!file || loading} className="submit-btn">
            {uploadProgress > 0 && uploadProgress < 100
              ? `Uploading… ${uploadProgress}%`
              : loading
              ? "Processing…"
              : "Upload File"}
          </button>
        </form>

        {loading && (
          <div
            className="progress"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={uploadProgress}
          >
            <div className="progress-bar" style={{ width: `${uploadProgress}%` }}>
              {uploadProgress >= 100 ? "Processing…" : `${uploadProgress}%`}
            </div>
          </div>
        )}

        {downloadLink && (
          <div className="download-section">
            <h2 className="download-title">🎉 Predictions Ready!</h2>
            <a href={downloadLink} download="predictions.xlsx" className="download-link">
              Download File
            </a>
          </div>
        )}

        {error && <p className="error">{error}</p>}

        <div className="team-section" id="team">
          <h3>Project Team</h3>
          <div className="team-grid">
            {teamMembers.map((m) => (
              <div key={m.name} className="team-member">
                <p>{m.name}</p>
                <a href={m.linkedin} target="_blank" rel="noopener noreferrer">
                  LinkedIn Profile
                </a>
              </div>
            ))}
          </div>
          <p style={{ marginTop: "1.5rem" }}>
            <em>Mentor: Mr. Rohan Shah</em>
          </p>
        </div>

        <footer>
          <p>Spartificial Innovations Pvt. Ltd. | Exoplanet Detection Using Sequence Models © 2025</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
