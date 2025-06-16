🎮 Code To Play – AI Game Generator
Live Demo: code-to-play.vercel.app

An AI-powered game generator that transforms plain text ideas into playable browser-based games in seconds. Built to accelerate game prototyping and inspire creativity for developers, students, and designers.

✨ Features
🧠 AI-Powered Generation: Uses Google Gemini to convert user prompts into complete game logic.

⚡ Real-time Game Preview: Instantly play and test generated games in-browser using Phaser.

💡 Prompt-to-Play: Just describe your idea (e.g., "a Flappy Bird clone with dragons") and get a functional game.

💾 Editable Code Preview: Shows editable game config/code generated from your input.

🛠️ Developer-Ready Stack: Built using scalable, modern frameworks.

🛠️ Tech Stack
Frontend: React + Next.js + TailwindCSS

Game Engine: Phaser.js

Backend: Node.js + Express

AI Integration: Google Gemini API (Generative AI)

Communication: Axios, REST APIs

Deployment: Vercel (Frontend) & Render/Fly.io/Custom (Backend)

📦 Project Structure
bash
Copy
Edit
.
├── frontend/               # React + Next.js client
│   ├── pages/
│   ├── components/
│   └── styles/
├── backend/                # Express.js server
│   └── routes/
│   └── services/           # Gemini integration logic
├── public/
└── README.md
🚀 Getting Started
1. Clone the repository
bash
Copy
Edit
git clone https://github.com/your-username/code-to-play.git
cd code-to-play
2. Setup Environment
Create a .env file in backend/:

ini
Copy
Edit
GEMINI_API_KEY=your_gemini_api_key
3. Install Dependencies
bash
Copy
Edit
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
4. Run the App
bash
Copy
Edit
# Start Backend
cd backend
npm run dev

# Start Frontend
cd ../frontend
npm run dev
Visit http://localhost:3000

📌 Use Cases
🧒 Students: Learn programming through gamified prompts.

🎨 Designers: Prototype game logic before full implementation.

👨‍💻 Developers: Kickstart indie game ideas and MVPs.

🎮 Educators: Make coding engaging through interactive learning.

🏆 Achievements
🥉 Top-3 Finalist in National Hackathon 2025

🚀 Recognized for innovation in generative AI + game dev

🤝 Contributing
Have an idea or feature request? PRs and issues welcome!
