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
