# InvestMate

**InvestMate** is an AI-powered investment companion for beginners. It helps users build a basic stock portfolio, learn about safe investment strategies, and ask questions through a built-in conversational assistant.

---

## 🧠 Key Features

- 🔍 Search and explore real-time stock data
- 🤖 Chat with an AI assistant to learn investing basics
- 📈 Build a simple portfolio with beginner-friendly suggestions
- 🧾 Get educational summaries for stocks you're considering
- 💡 Designed for new investors with little to no financial background

---

## 🖥️ Tech Stack

| Frontend         | Backend          | AI / Data     |
|------------------|------------------|---------------|
| React + Tailwind | FastAPI (Python) | OpenAI GPT-4  |
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
    └── requirements.txt # Python dependencies
```

## Frontend Setup

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

The frontend will be available at http://localhost:3000

## Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Start the FastAPI server:
   ```bash
   uvicorn app.main:app --reload
   ```

The backend API will be available at http://localhost:8000

## Technologies Used

- **Frontend**: React, Tailwind CSS, PostCSS
- **Backend**: FastAPI, Python
- **Development**: Hot reloading, TypeScript support

## Features

- Modern, responsive UI with Tailwind CSS
- FastAPI backend with automatic API documentation
- Development environment with hot reloading
- Clean project structure with proper separation of concerns 