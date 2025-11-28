# CardioCare

CardioCare is a comprehensive stress management and wellness application designed to monitor, analyze, and provide actionable insights into your stress levels. The app integrates machine learning models, interactive dashboards, and personalized recommendations to help users maintain their mental and physical well-being.

## Features

### 1. Stress Analysis
- **Real-time Stress Monitoring**: Analyze stress levels using metrics like HRV, heart rate, and breathing rate.
- **AI-Powered Insights**: Get detailed stress analysis and recommendations based on your data.

### 2. Notifications
- **Alerts**: Receive notifications for critical stress levels.
- **Dynamic Updates**: Alerts are sorted in reverse chronological order for easy tracking.

### 3. Insights
- **Major Stress Reasons**: Visual representation of key stress factors with icons.
- **Weekly Trends**: View stress trends over the past week.

### 4. Wellness Plan
- **Editable Plans**: Customize your daily wellness plan.
- **Recommendations**: Get personalized suggestions to improve your well-being.

## Technologies Used

### Frontend
- **React**: For building interactive user interfaces.
- **TypeScript**: Ensures type safety and better developer experience.
- **Tailwind CSS**: Provides utility-first styling for rapid UI development.

### Backend
- **Python**: Powers the machine learning models and API endpoints.
- **Flask**: Serves as the backend framework.

### Machine Learning
- **TensorFlow/Keras**: Used for building and training the stress analysis model.
- **Pretrained Model**: `neurocare_stress_model.h5` for stress prediction.

### Data
- **Datasets**: Includes `heart_dataset.csv` and `cleaned_dataset.csv` for training and analysis.
- **JSON**: Stores predefined stress analysis responses.

## Folder Structure

```
app/
├── src/
│   ├── components/       # Reusable UI components
│   ├── contexts/         # Context API for state management
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions and API integrations
│   ├── pages/            # Application pages (Dashboard, Insights, etc.)
│   └── App.tsx           # Main application entry point
├── public/               # Static assets
├── package.json          # Project dependencies
└── README.md             # Project documentation
```

## Getting Started

### Prerequisites
- **Node.js**: Install the latest version from [Node.js](https://nodejs.org/).
- **Python**: Install Python 3.8+ from [Python.org](https://www.python.org/).

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/rajarshidattapy/cardiocare.git
   cd cardiocare
   ```

2. Install frontend dependencies:
   ```bash
   cd app
   npm install
   ```

3. Set up the Python environment:
   ```bash
   python -m venv venv
   & .\venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   ```

### Running the Application

1. Start the backend server:
   ```bash
   python app.py
   ```

2. Start the frontend development server:
   ```bash
   cd app
   npm run dev
   ```

3. Open the application in your browser at `http://localhost:3000`.

## Contributing

We welcome contributions! Please follow these steps:
1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Submit a pull request with a detailed description of your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **Icons**: Provided by Lucide React.
- **UI Design**: Inspired by modern wellness applications.
- **Community**: Thanks to all contributors and users for their support.