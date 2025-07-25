# Finsight: AI-Powered Investment Chatbot

[Live Demo](https://finsight-seven.vercel.app/) | [Demo Video](https://youtu.be/EJfrLT2qebY)

---

## Overview

Finsight is an AI chatbot that provides real-time financial insights by combining GPT-4.1 with live company data. Ask questions, get detailed answers, and explore company financials — all through a smooth conversational interface.

---

## Features

- **Conversational History:** Easily scroll back through your past chats to review insights.
- **Real-Time Financial Data:** Fetches up-to-date information from Financial Modeling Prep (FMP) APIs.
- **AI-Powered Answers:** Uses OpenAI GPT-4.1 with tool calling for precise, context-aware responses.
- **Clean UI:** Built with Next.js and ShadCN UI components for a modern, responsive experience.

---

## Tech Stack

- **OpenAI GPT-4.1** (Tool Calling enabled)
- **Financial Modeling Prep (FMP) API**
- **Next.js** (React framework)
- **ShadCN UI** (Component library based on Tailwind CSS)
- **Upstash Redis** (For rate limiting)

---

## Screenshots

<img width="2559" height="1388" alt="Screenshot 2025-07-23 230911" src="https://github.com/user-attachments/assets/cab5e72b-b710-4929-ba5d-c0e8ed6f1771" />
<img width="1268" height="1297" alt="Screenshot 2025-07-23 233025" src="https://github.com/user-attachments/assets/897288e1-7d51-4823-af09-a5f23e4543fe" />
<img width="1277" height="1291" alt="Screenshot 2025-07-23 233042" src="https://github.com/user-attachments/assets/80476f08-328c-4000-b645-1eed1e16aeff" />

---

## Getting Started

1. Clone the repo  
   ```bash
   git clone https://github.com/mabelzhou/finsight.git
   cd finsight
2. Install dependencies
   ```cash
   npm install
3. Set up your `.env` file with your OpenAI, FMP, and Upstash credentials as seen in `.env.example`.
4. Run the development server
   ```bash
   npm run dev
