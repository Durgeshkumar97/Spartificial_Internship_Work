# 🌌 Exoplanet Prediction App  

An **AI-powered tool** to detect exoplanets using **RNN sequence models** on stellar flux data.  
Built during a **research internship at Spartificial Innovations Pvt. Ltd.**

---

## 🚀 Abstract
The project **"Hunting for Exoplanets using Sequence Models"** aimed to explore detection of exoplanets through advanced data analysis and machine learning.  

By leveraging **stellar flux time series** (Kaggle dataset) and using **RNN/LSTM models**, we identified subtle light dimming patterns when planets transit across stars.  

Key contributions:
- Exploratory Data Analysis (EDA) with **Matplotlib, Seaborn, Plotly**  
- Outlier detection and preprocessing  
- Class imbalance handling with **Random Oversampling**  
- Model implementation using **Keras (RNN/LSTM)**  
- Achieved **80% accuracy on exoplanet stars** and **73% on non-exoplanet stars**  

---

## 📊 Introduction
- **Exoplanets**: Planets outside our solar system, detected through changes in stellar brightness.  
- **Sequence Models**: RNNs and LSTMs that capture temporal patterns in stellar flux data.  
- **Challenge**: Detecting exoplanets from noisy, imbalanced datasets.  

---

## 🧪 Proposed Solution
1. **Data Visualization**  
   - Matplotlib → bar plots, pie charts  
   - Plotly → interactive scatter/line/box plots  
   - Seaborn → heatmaps for correlations  

2. **Outlier Detection**  
   - Box plots → identify and handle flux anomalies  

3. **Class Imbalance Handling**  
   - Random Oversampling → balance star systems with/without exoplanets  

4. **Model Implementation**  
   - LSTM initially, but shifted to **RNN** for efficiency and accuracy  
   - Dataset split into **train/test**  
   - Evaluation with accuracy, F1 score, and confusion matrix  

5. **Results**  
   - Confusion Matrix:  
     ```
     [[412, 153],
      [  1,   4]]
     ```
   - **Exoplanet stars:** 80% accuracy  
   - **Non-exoplanet stars:** 73% accuracy  

---

## 📈 Experimental Results
- RNN with oversampling improved detection sensitivity.  
- Outperformed earlier models applied on this dataset.  
- Still room for improvement (accuracy < 100%).  
- Future directions:  
  - New datasets  
  - Real-time streaming stellar flux  
  - Advanced architectures (Transformers for time-series)  

---

## 🛠 Tech Stack
- **Backend**: FastAPI, TensorFlow/Keras, NumPy, Pandas, Scikit-learn  
- **Frontend**: React.js, Axios, Styled Components  
- **Visualization**: Matplotlib, Seaborn, Plotly  
- **Deployment Ready**: REST API + React frontend  

---

## 📂 Project Structure
```
my-react-app/
│── backend/
│ └── app/
│ ├── api/
│ ├── config/
│ ├── models/
│ │ └── weights/
│ │ └── PLACE_MODEL_HERE.txt
│ ├── utils/
│ └── main.py
│── frontend/
│ └── src/
│ ├── App.js
│ ├── App.css
│ └── components/
│── requirements.txt
│── package.json
│── README.md
```

---

## 👥 Contributors
- **[Ahamika Pattnaik](https://www.linkedin.com/in/ahamikapattnaik/)**  
- **[Durgesh Duklan](https://www.linkedin.com/in/durgeshkumar3/)**  
- **[Sukant Neve](https://www.linkedin.com/in/sukant-neve/)**  
- **[Zainul Panjwani](https://www.linkedin.com/in/zainul-panjwani-920aa9160/)**  

**Mentor:** *Mr. Rohan Shah*  

---

## 📜 License
This project is licensed under the **MIT License** – feel free to use the code, but model weights and datasets are excluded from redistribution.  

---

