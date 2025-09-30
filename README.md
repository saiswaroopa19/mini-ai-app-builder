#  Mini AI App Builder Portal

Turn your app ideas into structured requirements and a working mock UI in seconds.

Project Link: https://github.com/saiswaroopa19/mini-ai-app-builder

---

##  Objective

- Users describe an app in natural language.  
- Backend extracts structured requirements via AI.  
- Frontend dynamically builds a simple UI (forms, menus) from those requirements.  
- User authentication and history support for real usage.

---

##  Key Features & Innovations

-  **JWT Authentication** — secure login with HTTP-only cookies.  
-  **Prompt History Page** — view and reuse previous ideas.  
-  **Prompt Guidance** — help users frame helpful prompts for better AI output.  
-  **Fallback JSON** — UI is generated even if AI response times out.  
-  **Modular Architecture** — clear separation of services, middleware, routes.

---

##  Tech Stack

- **Frontend:** React (Vite)  
- **Backend:** Node.js + Express  
- **Database:** MongoDB (local)  
- **AI Model:** DeepSeek-R1  
- **Auth:** JWT + HTTP-only Cookies  

---

##  Local Setup Guide

Follow these steps to run the project locally:

### 1. Clone the repo

```bash
git clone https://github.com/saiswaroopa19/mini-ai-app-builder.git
cd mini-ai-app-builder
