import os
from openai import OpenAI

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

SYSTEM_PROMPT = """You are an AI investing assistant for InvestMate, a beginner-friendly investing sandbox platform. 

Your role is to:
- Help new investors learn about stocks, investing concepts, and financial literacy
- Provide educational explanations about stock market basics
- Answer questions about portfolio management and diversification
- Explain financial terms in simple, beginner-friendly language
- Offer general investing guidance (NOT personalized financial advice)

Guidelines:
- Keep responses clear, concise, and educational
- Use simple language suitable for beginners
- Encourage learning and smart investing practices
- Never guarantee returns or make specific investment recommendations
- Remind users this is a learning sandbox, not real trading
- Be encouraging and supportive of users learning to invest

Remember: You're a teacher, not a financial advisor. Focus on education over advice."""


def get_ai_response(user_message: str, conversation_history: list = None) -> str:
    """
    Get AI response using OpenAI GPT-4o-mini
    
    Args:
        user_message: The user's message
        conversation_history: Optional list of previous messages [{"role": "user"/"assistant", "content": "..."}]
    
    Returns:
        AI assistant's response
    """
    try:
        # Build messages array
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]
        
        # Add conversation history if provided
        if conversation_history:
            messages.extend(conversation_history)
        
        # Add current user message
        messages.append({"role": "user", "content": user_message})
        
        # Call OpenAI API
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            temperature=0.7,
            max_tokens=500,  # Keep responses concise
        )
        
        return response.choices[0].message.content
    
    except Exception as e:
        print(f"Error calling OpenAI API: {e}")
        return "I'm having trouble connecting right now. Please make sure your OpenAI API key is set up correctly."


def get_stock_analysis(symbol: str, stock_data: dict) -> str:
    """
    Get AI analysis of a specific stock (for educational purposes)
    
    Args:
        symbol: Stock symbol
        stock_data: Dictionary containing stock information
    
    Returns:
        Educational analysis of the stock
    """
    try:
        prompt = f"""Provide a brief, beginner-friendly educational overview of {symbol} ({stock_data.get('name', 'N/A')}).

Current Price: ${stock_data.get('price', 'N/A')}

Focus on:
1. What the company does (1-2 sentences)
2. Key factors beginners should understand about this stock
3. General industry trends

Keep it under 150 words and educational, not advisory."""

        messages = [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt}
        ]
        
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            temperature=0.7,
            max_tokens=300,
        )
        
        return response.choices[0].message.content
    
    except Exception as e:
        print(f"Error getting stock analysis: {e}")
        return "Unable to provide analysis at this time."

