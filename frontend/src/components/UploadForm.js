import React, { useState } from 'react';
import axios from 'axios';

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [downloadLink, setDownloadLink] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setDownloadLink(null);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post("http://localhost:8000/predict", formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob',
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        }
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      setDownloadLink(url);
    } catch (err) {
      console.error(err);
      setError("An error occurred while processing the request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="form">
        <input type="file" onChange={handleFileChange} className="file-input" />
        <button type="submit" className="submit-btn" disabled={!file || loading}>
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>

      {loading && <div className="progress"><div className="progress-bar" style={{ width: `${uploadProgress}%` }}>{uploadProgress}%</div></div>}
      {downloadLink && <a href={downloadLink} download="predictions.xlsx" className="download-link">Download Predictions</a>}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default UploadForm;
