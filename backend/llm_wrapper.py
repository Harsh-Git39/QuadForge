"""Wrapper for Emergent Platform API"""
import httpx
from typing import Optional

class UserMessage:
    def __init__(self, content: str = None, text: str = None):
        self.content = content or text
        if not self.content:
            raise ValueError("Either 'content' or 'text' must be provided")

class LlmChat:
    def __init__(self, api_key: str, session_id: str = None, system_message: str = ""):
        self.api_key = api_key
        self.system_message = system_message
        self.model = "gemini-1.5-flash"
        
    def with_model(self, provider: str, model: str):
        """Set the model to use"""
        if "gemini" in model.lower():
            self.model = "google/gemini-flash-1.5"
        return self
    
    async def send_message_async(self, message: UserMessage) -> str:
        """Send message via Emergent Platform (async)"""
        return await self._send_message(message)
    
    async def send_message(self, message: UserMessage) -> str:
        """Send message via Emergent Platform (alias for compatibility)"""
        return await self._send_message(message)
    
    async def _send_message(self, message: UserMessage) -> str:
        """Internal method to send message"""
        url = "https://api.emergentagi.com/v1/chat/completions"
        
        # Build messages array
        messages = []
        if self.system_message:
            messages.append({"role": "system", "content": self.system_message})
        messages.append({"role": "user", "content": message.content})
        
        payload = {
            "model": self.model,
            "messages": messages,
            "max_tokens": 2000
        }
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(url, json=payload, headers=headers)
                response.raise_for_status()
                result = response.json()
                return result['choices'][0]['message']['content']
        except Exception as e:
            return f"AI analysis unavailable: {str(e)}"
