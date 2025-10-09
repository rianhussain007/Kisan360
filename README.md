
# Kisan360: The AI Smart Farming Assistant

> **Hackathon Submission**  
> This project is a submission for **VYUHATECH 2.0 National Level Hackathon**

## 🌱 Empowering India's Farmers with Data-Driven Insights

## Problem Statement
Indian smallholder farmers face significant challenges due to climate change, pest infestations, and market volatility. These factors lead to unpredictable crop yields, financial instability, and reduced agricultural productivity. Farmers often lack access to timely, localized information that could help them make better farming decisions.

## Our Solution
Kisan360 is a mobile-first web application that leverages artificial intelligence and real-time data to provide hyper-personalized farming advice. By integrating weather forecasts, soil conditions, market prices, and computer vision, we deliver actionable insights directly to farmers' smartphones in their local language.

## ✨ Key Features

- **📍 Personalized Onboarding**
  Select your primary crop (wheat, rice, maize, cotton, sugarcane, potato) and season (Kharif, Rabi, Zaid) for tailored advice.

- **🌦️ Live Weather Intelligence**
  7-day weather forecast with condition icons, integrated with AI-driven farming recommendations.

- **📅 Interactive Daily Advisor**
  Dynamic task checklists that adapt to weather conditions, with interactive checkboxes and persistent completion tracking.

- **📸 AI Crop Disease Scanner**
  Upload leaf images for instant disease detection using TensorFlow.js models and PlantNet API integration.

- **📈 Real-Time Market Analysis**
  Live commodity prices with interactive charts and buyer connection tools.

- **🗺️ Farm Mapping & Resources**
  GPS-based farm location mapping and nearby resource finder for seeds, fertilizers, and agricultural stores.

- **🤖 Gemini AI Integration**
  Personalized farming tips and recommendations powered by Google Gemini AI.

## 🛠️ Technology Stack

### Frontend
- **React 19** with TypeScript
- **Next.js 15** (App Router)
- **Tailwind CSS** for styling
- **Shadcn/ui** component library
- **Lucide React** for icons
- **SWR** for data fetching and caching

### Backend & APIs
- **Next.js API Routes** (Serverless functions)
- **Google Gemini AI** for dynamic content generation
- **TensorFlow.js** for client-side ML inference

### External Integrations
- **OpenWeatherMap API** for weather data
- **Google Maps Platform** for location services
- **PlantNet API** for plant species identification
- **Agmarknet API** for market price data

### Data & Storage
- **localStorage** for client-side persistence
- **Environment variables** for API key management

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/pnpm
- Git

### Local Development Setup

1. **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/kisan360.git
    cd kisan360
    ```

2. **Install dependencies**
    ```bash
    npm install
    # or
    pnpm install
    ```

3. **Set up environment variables**
    Create a `.env.local` file in the root directory:
    ```env
    OPENWEATHERMAP_API_KEY=your_openweather_api_key
    PLANTNET_API_KEY=your_plantnet_api_key
    GOOGLE_MAPS_API_KEY=your_google_maps_api_key
    AGMARKNET_API_KEY=your_agmarknet_api_key
    GEMINI_API_KEY=your_gemini_api_key
    ```

4. **Start the development server**
    ```bash
    npm run dev
    # or
    pnpm dev
    ```

5. **Access the application**
    Open [http://localhost:3000](http://localhost:3000) in your browser

### Key Pages
- **/** - Main dashboard with weather, market, and AI recommendations
- **/onboarding** - Initial setup with crop and season selection
- **/daily** - Interactive daily advisor with weather-driven task checklist
- **/scanner** - AI-powered crop disease detection using TensorFlow.js
- **/farm** - Farm location mapping with Google Maps
- **/market** - Real-time market prices and buyer connections
- **/resources** - Nearby agricultural resources finder

## 🏗️ Architecture Overview

Kisan360 is built as a **Next.js monolith** with API routes, providing:
- **Server-Side Rendering** for optimal performance
- **Client-side ML inference** with TensorFlow.js
- **AI-powered content generation** via Google Gemini
- **Progressive Web App** capabilities for offline access
- **Responsive design** optimized for mobile farmers

### Recent Enhancements
- ✅ **Interactive Daily Advisor**: Checkboxes with persistent task tracking
- ✅ **Weather-Driven Tasks**: AI adapts recommendations based on forecast
- ✅ **Personalized Onboarding**: Crop and season selection for tailored advice
- ✅ **Enhanced UI**: Weather icons, visual task states, mobile optimization
- ✅ **Gemini Integration**: Dynamic content generation for farming tips

## 🤝 Contributing
We welcome contributions from the community! Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team
- **Rian Hussain** - Lead Developer & System Architect
- **Shree Sagar Y N** - Product Lead & UI/UX Strategist

## 📊 Project Status
- ✅ **Core Features**: Weather, AI Scanner, Market Integration
- ✅ **Enhanced Daily Advisor**: Interactive checklist with AI personalization
- ✅ **Mobile Responsive**: Optimized for farmer accessibility
- ✅ **AI Integration**: Gemini-powered dynamic recommendations
- 🚧 **Future**: Backend database, push notifications, IoT integration

##  Acknowledgments
- Farmers and agricultural experts who provided valuable insights
- Open-source communities for their amazing tools and libraries
- Mentors and organizers of VYUHATECH 2.0

