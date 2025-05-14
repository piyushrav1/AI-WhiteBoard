# AI-WhiteBoard
Real-Time Multi-User AI Whiteboard

🗂️ High-Level Architecture

🎨 Frontend (React + Canvas + Chat UI)
Real-time whiteboard with drawing tools

Chat interface (for user & AI messages)

Room code or user auth for session

Live user cursors (optional)

⚙️ Backend (Node.js + Express + Socket.IO)
Handle WebSocket connections

Broadcast drawing and chat events

Handle AI message requests (via API calls)

Track room users and sessions

📦 Database (MongoDB)
Store chat history and AI messages

Whiteboard snapshots (optional)

Room/session metadata

🤖 AI Integration
OpenAI / Google Gemini API

Use it to:

Summarize chat

Suggest ideas/drawings

Answer user questions

☁️ Deployment
Google Cloud Run or App Engine: Backend + Socket.IO

Firebase Hosting or Vercel: React frontend

MongoDB Atlas: Cloud DB

Google Cloud Function (optional): Proxy for AI API for security
