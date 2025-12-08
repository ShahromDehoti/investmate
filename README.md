# InvestMate

**InvestMate** is a beginner-friendly, AI-powered investing sandbox designed to help new investors learn the stock market in a safe and interactive way.

Users can:
- Build a **virtual stock portfolio** with real-time data using `yfinance`
- Interact with an **AI assistant** to get personalized investing advice and explanations
- Learn core investing concepts without the risk of real money
- Receive AI-backed **stock suggestions** based on goals and risk tolerance

InvestMate is not a trading platform — it's a guided learning tool for users who want to build confidence and financial literacy before entering the real market.

---

## Key Features

- Search and explore real-time stock data
- Chat with an AI assistant to learn investing basics
- Build a simple portfolio with beginner-friendly suggestions
- Get educational summaries for stocks you're considering
- Designed for new investors with little to no financial background

---

## Tech Stack

| Frontend         | Backend          | AI / Data     |
|------------------|------------------|---------------|
| React + Tailwind | FastAPI (Python) | OpenAI GPT-4o-mini  |
| Axios, Recharts  | yFinance         | Yahoo Finance |

---

## Project Structure

```
InvestMate/
├── frontend/          # React application with Tailwind CSS
│   ├── src/          # React source code
│   ├── public/       # Static assets
│   ├── package.json  # Node.js dependencies
│   └── tailwind.config.js # Tailwind CSS configuration
└── backend/          # FastAPI application
    ├── app/          # FastAPI source code
    ├── routers/      # API endpoints
    ├── services/     # Business logic (AI, portfolio, stocks)
    ├── models/       # Database models
    └── requirements.txt # Python dependencies
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Activate the virtual environment:
   ```bash
   source .venv/bin/activate  # On macOS/Linux
   # On Windows: .venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up your OpenAI API key:
   ```bash
   export OPENAI_API_KEY='your-api-key-here'
   # On Windows: set OPENAI_API_KEY=your-api-key-here
   ```

5. Start the FastAPI server:
   ```bash
   uvicorn app.main:app --reload
   ```

The backend API will be available at **http://localhost:8000** (API docs at http://localhost:8000/docs)

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The frontend will be available at **http://localhost:3000** (opens automatically in your browser)

---

## Environment Variables

The backend requires the following environment variable:

- `OPENAI_API_KEY` - Your OpenAI API key for the AI chatbot functionality

You can get an API key from [OpenAI Platform](https://platform.openai.com/api-keys)

---

## Features

### Home Page
Welcome page with quick access to all features

### Portfolio Page
- View your virtual portfolio with real-time stock prices
- Track gains/losses and performance metrics
- Edit or remove holdings
- View detailed stock charts

### Search Page
- Search for stocks by symbol
- View current price and company information
- Add stocks to your portfolio

### 🤖 AI Chatbot
- Available on all pages via floating button (bottom-right)
- Ask questions about investing, stocks, and financial concepts
- Get beginner-friendly educational responses
- Powered by OpenAI GPT-4o-mini

---

## Technologies Used

- **Frontend**: React, Tailwind CSS, Axios, Recharts
- **Backend**: FastAPI, Python, SQLAlchemy
- **AI**: OpenAI GPT-4o-mini
- **Data**: yFinance (Yahoo Finance API)
- **Database**: SQLite (for portfolio storage)

---

## Development

Both services support hot reloading:
- Backend: `--reload` flag enables auto-reload on code changes
- Frontend: React development server auto-reloads on save

---

## API Documentation

Once the backend is running, visit **http://localhost:8000/docs** for interactive API documentation powered by FastAPI's automatic OpenAPI generation.

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.
