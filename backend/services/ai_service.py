# import os
# import json
# import httpx

# OPENAI_API_URL = "https://api.openai.com/v1/chat/completions"

# SYSTEM_PROMPT = """You are an AI investing assistant for InvestMate, a beginner-friendly investing sandbox platform.
#
# Your role is to:
# - Help new investors learn about stocks, investing concepts, and financial literacy
# - Provide educational explanations about stock market basics
# - Answer questions about portfolio management and diversification
# - Explain financial terms in simple, beginner-friendly language
# - Offer general investing guidance (NOT personalized financial advice)
#
# Guidelines:
# - Keep responses clear, concise, and educational
# - Use simple language suitable for beginners
# - Encourage learning and smart investing practices
# - Never guarantee returns or make specific investment recommendations
# - Remind users this is a learning sandbox, not real trading
# - Be encouraging and supportive of users learning to invest
#
# Remember: You're a teacher, not a financial advisor. Focus on education over advice."""


async def get_ai_response(user_message: str, conversation_history: list = None) -> str:
    """
    Placeholder for AI response — OpenAI integration coming soon.
    """
    return "This feature is coming soon! We're working on integrating an AI assistant to help you learn about investing."


async def get_stock_analysis(symbol: str, stock_data: dict) -> str:
    """
    Placeholder for stock analysis — OpenAI integration coming soon.
    """
    return "AI-powered stock analysis is coming soon!"


# --- OpenAI integration (uncomment when ready) ---
#
# async def get_ai_response(user_message: str, conversation_history: list = None) -> str:
#     api_key = os.getenv("OPENAI_API_KEY")
#     if not api_key:
#         return "The AI assistant is not configured yet. Please set the OPENAI_API_KEY environment variable."
#
#     messages = [{"role": "system", "content": SYSTEM_PROMPT}]
#
#     if conversation_history:
#         messages.extend(conversation_history)
#
#     messages.append({"role": "user", "content": user_message})
#
#     headers = {
#         "Authorization": f"Bearer {api_key}",
#         "Content-Type": "application/json",
#     }
#
#     payload = {
#         "model": "gpt-4o-mini",
#         "messages": messages,
#         "temperature": 0.7,
#         "max_tokens": 500,
#     }
#
#     try:
#         async with httpx.AsyncClient(timeout=30.0) as client:
#             response = await client.post(OPENAI_API_URL, headers=headers, json=payload)
#             response.raise_for_status()
#             data = response.json()
#             return data["choices"][0]["message"]["content"]
#     except httpx.HTTPStatusError as e:
#         print(f"OpenAI API error: {e.response.status_code} - {e.response.text}")
#         return "I'm having trouble connecting to the AI service. Please check your API key."
#     except Exception as e:
#         print(f"Error calling OpenAI API: {e}")
#         return "I'm having trouble connecting right now. Please try again later."
#
#
# async def get_stock_analysis(symbol: str, stock_data: dict) -> str:
#     prompt = f"""Provide a brief, beginner-friendly educational overview of {symbol} ({stock_data.get('name', 'N/A')}).
#
# Current Price: ${stock_data.get('price', 'N/A')}
#
# Focus on:
# 1. What the company does (1-2 sentences)
# 2. Key factors beginners should understand about this stock
# 3. General industry trends
#
# Keep it under 150 words and educational, not advisory."""
#
#     return await get_ai_response(prompt)
