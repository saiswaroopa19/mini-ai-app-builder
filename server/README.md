# 🧠 Mini AI App Builder (React + Node + Mongo + GitHub LLM)

A tiny full-stack portal that:

1. Captures an app idea prompt from the user
2. Sends it to a GitHub-hosted AI model (deepseek/DeepSeek-R1)
3. Extracts structured requirements: App Name, Entities, Roles, Features, Menu, and Forms
4. Dynamically generates a mock UI (tabs for roles; forms for each entity)
5. Optionally stores the prompt + AI response linked to a user in MongoDB

✅ Deploy-ready: Node.js backend on Render, React frontend on Netlify/Vercel/Render Static.
✅ MongoDB Atlas optional but recommended for saving prompt history and user data.

---

🏗️ Architecture

client (Vite + React)
↕ POST /prompts/generate (user prompt)
server (Express + Node)
↕ GitHub DeepSeek Model (JSON response)
MongoDB (Atlas) [for users + prompts history]

---

📦 Spec JSON Structure

The AI always returns structured JSON in this shape:

{
"app_name": "Course Manager",
"entities": ["Student", "Course", "Grade"],
"roles": ["Teacher", "Student", "Admin"],
"features": ["Add course", "Enrol students", "View reports"],
"menu_options": ["Student", "Teacher", "Admin"],
"forms": {
"Student": { "name": "string", "email": "string", "age": "number" },
"Course": { "title": "string", "code": "string", "credits": "number" },
"Grade": { "student": "string", "course": "string", "grade": "string" }
}
}

If the user’s prompt is vague or not about an app, the model returns:

{ "error": "Incorrect data or insufficient data." }

---

🧪 MongoDB Collections

We now use two main collections:

- users – Stores user info with hashed password
    - id, email, password, name
- prompts – Stores each submitted prompt and AI response
    - user_id, prompt, app_name, entities, roles, features, menu_options, forms

---

⚙️ Local Setup

0️⃣ Prerequisites

- Node.js 18+
- MongoDB Atlas (or local MongoDB)
- GitHub Personal Access Token (PAT) with model access

1️⃣ Backend (Server)

cd server
cp .env.sample .env

# Fill in:

# GITHUB_TOKEN=<your_pat_token>

# MONGO_URL=mongodb+srv://...

# JWT_SECRET=supersecretkey

# PORT=8080

npm install
npm run dev

Server runs on http://localhost:8080

2️⃣ Frontend (Client)

cd client
cp .env.sample .env

# set VITE_API_BASE=http://localhost:8080 (or your deployed API URL)

npm install
npm run dev

Visit the app at http://localhost:5173

---

🧪 API Endpoints

🔐 User Auth

Signup:
curl -X POST http://localhost:8080/users/signup \
 -H "Content-Type: application/json" \
 -d '{
"email": "test@example.com",
"password": "mypassword",
"name": "Test User"
}'

Login:
curl -X POST http://localhost:8080/users/login \
 -H "Content-Type: application/json" \
 -d '{
"email": "test@example.com",
"password": "mypassword"
}' \
 -c cookies.txt

---

🤖 Generate Requirements

curl -X POST http://localhost:8080/prompts/generate \
 -H "Content-Type: application/json" \
 -d '{
"user_id": "<USER_ID_FROM_DB>",
"prompt": "I want an app to manage hostel room allocations for students and track payments."
}'

✅ Returns:

{
"success": true,
"data": {
"\_id": "66f6f0d8aa3f5b1bdbf9c421",
"user_id": "66f6e28c45f6a6123d5c1a90",
"prompt": "I want an app to manage hostel room allocations...",
"app_name": "Hostel Manager",
"entities": ["Student", "Room", "Payment"],
"roles": ["Student", "Admin"],
"features": ["Allocate room", "Track payments", "Generate reports"],
"menu_options": ["Student", "Admin"],
"forms": {
"Student": { "name": "string", "email": "string" },
"Room": { "room_number": "string", "capacity": "number" },
"Payment": { "amount": "number", "status": "string" }
}
}
}

---

📜 Fetch Prompt History

curl http://localhost:8080/prompts/history/<USER_ID>

---

☁️ Deployment

🚀 Backend on Render

1. Create a new Web Service from /server
2. Environment variables:
    - GITHUB_TOKEN
    - MONGO_URL
    - JWT_SECRET
    - PORT (Render sets automatically)
3. Start command: npm start

🌐 Frontend on Netlify / Vercel / Render Static

1. Set VITE_API_BASE to your backend URL
2. Build command:

npm install && npm run build

3. Publish directory: client/dist

---

🧪 How It Works (Checklist)

- ✅ Full-stack structure: /server (Express + GitHub Model) and /client (React)
- ✅ AI integration: /prompts/generate calls GitHub’s deepseek/DeepSeek-R1
- ✅ Persistent history: MongoDB stores prompt + structured response
- ✅ Dynamic UI: React renders role tabs & forms based on entities
- ✅ JWT Auth: Users are securely authenticated before generating prompts

---

🛠️ Troubleshooting

- require is not defined → Remove "type": "module" from package.json or switch all code to import.
- MongoDB not connecting → Check your MONGO_URL and whitelist your IP in MongoDB Atlas.
- GitHub token invalid → Regenerate a Personal Access Token with model access.
- AI did not return valid JSON → Updated prompt instructions + JSON extraction fix this (see services/github_models.js).
- CORS errors → Ensure cors() is enabled and VITE_API_BASE points to the correct backend URL.

---

🧠 Bonus Ideas

- Add a "Regenerate Requirements" button with temperature slider
- Export generated spec as .json or .yaml
- Visualize entities and relationships as a graph
- Enable collaboration: multiple users editing the same app idea

---

📊 Project Flow Diagram

[Frontend: React]
│
▼
POST /prompts/generate ──► [Backend: Express]
│
▼
[GitHub LLM API: deepseek/DeepSeek-R1]
│
▼
Structured JSON Response
│
▼
[MongoDB] ←─ stores prompt + response
│
▼
[React UI] ←─ renders dynamic tabs & forms
