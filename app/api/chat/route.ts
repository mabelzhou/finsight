import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const POST = async (req: Request) => {
  const { messages } = await req.json();

  const stream = await openai.chat.completions.create({
    model: 'gpt-4',
    messages, // [{ role: 'user', content: 'Hello!' }, ...]
    stream: true, 
  });

  let reply = '';
  for await (const chunk of stream) {
    const content = chunk.choices?.[0]?.delta?.content;
    if (content) {
      reply += content;
    }
  }

  return Response.json({ reply });
};
