
# Kisan360: The AI Smart Farming Assistant

> **Hackathon Submission**  
> This project is a submission for **VYUHATECH 2.0 National Level Hackathon**

## 🌱 Empowering India's Farmers with Data-Driven Insights

## Problem Statement
Indian smallholder farmers face significant challenges due to climate change, pest infestations, and market volatility. These factors lead to unpredictable crop yields, financial instability, and reduced agricultural productivity. Farmers often lack access to timely, localized information that could help them make better farming decisions.

## Our Solution
Kisan360 is a mobile-first web application that leverages artificial intelligence and real-time data to provide hyper-personalized farming advice. By integrating weather forecasts, soil conditions, market prices, and computer vision, we deliver actionable insights directly to farmers' smartphones in their local language.

## ✨ Key Features

- **📍 Hyper-Local Advisory**  
  Get personalized farming recommendations based on your exact GPS location, soil type, and crop selection.

- **🌦️ Live Weather & Alerts**  
  Real-time weather updates and early warnings for extreme conditions like droughts, heavy rain, or temperature fluctuations.

- **📸 AI Crop Scanner**  
  Simply take a photo of a plant leaf to instantly detect potential diseases and pest infestations.

- **📈 Market Price Tracking**  
  Access real-time price data from nearby agricultural markets (mandis) to sell your produce at the best possible price.

- **🌱 Crop Planning Tool**  
  AI-powered suggestions for crop rotation and optimal planting times based on local conditions.

## 🛠️ Technology Stack

### Frontend
- React 18
- Next.js 14
- Tailwind CSS
- Shadcn UI Components
- Framer Motion
- React Hook Form
- Zod

### Backend
- Python 3.10+
- FastAPI
- SQLAlchemy
- PostgreSQL
- Redis (Caching)

### AI/ML
- TensorFlow/Keras (Disease Detection)
- OpenCV (Image Processing)
- Scikit-learn (Data Analysis)

### APIs & Services
- OpenWeatherMap API
- PlantNet API
- Google Maps Platform
- Agmarknet API
- Twilio (SMS Alerts)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Python 3.10+
- PostgreSQL 14+
- Redis

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/kisan360.git
   cd kisan360
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the frontend directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   NEXT_PUBLIC_OPENWEATHER_API_KEY=your_openweather_api_key
   ```

4. **Set up the backend**
   ```bash
   cd ../backend
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   pip install -r requirements.txt
   ```

5. **Run database migrations**
   ```bash
   alembic upgrade head
   ```

6. **Start the development servers**
   In separate terminal windows:
   ```bash
   # Frontend
   cd frontend
   npm run dev

   # Backend
   cd ../backend
   uvicorn app.main:app --reload
   ```

7. **Access the application**
   - Frontend: http://localhost:3000
   - API Docs: http://localhost:8000/docs

## 🤝 Contributing
We welcome contributions from the community! Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team
- [Team Member 1 Name] - Role
- [Team Member 2 Name] - Role
- [Team Member 3 Name] - Role
- [Team Member 4 Name] - Role

## 🙏 Acknowledgments
- Farmers and agricultural experts who provided valuable insights
- Open-source communities for their amazing tools and libraries
- Mentors and organizers of VYUHATECH 2.0

