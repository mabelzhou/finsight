import { OpenAI } from 'openai';
import { functionMap } from './functionMap';
import { tools } from './tools';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const POST = async (req: Request) => {
  const { messages } = await req.json();

  // First, ask OpenAI to respond — it may call a function
  const initialResponse = await openai.chat.completions.create({
    model: 'gpt-4.1', 
    messages,
    tools,
    tool_choice: 'auto',
  });

  const choice = initialResponse.choices[0];
  const toolCall = choice?.message?.tool_calls?.[0];

  // If OpenAI is calling a function:
  if (toolCall) {
    console.log('Tool call detected:', toolCall);
    const functionName = toolCall.function.name as keyof typeof functionMap;
    const args = JSON.parse(toolCall.function.arguments || '{}');

    const fn = functionMap[functionName];
    if (!fn) {
      return new Response(`Unknown function: ${functionName}`, { status: 400 });
    }

    try {
      const result = await fn(args);

      // Send function result back to OpenAI for final response
      const finalResponse = await openai.chat.completions.create({
        model: 'gpt-4.1',
        messages: [
          ...messages,
          {
            role: "system",
            content: `You are a financial assistant that uses real-time data from tools to 
            answer questions. Your knowledge cutoff is June 2024, but you can trust any data 
            returned from tools, including data after that date.`,
          },
          {
            role: 'assistant',
            tool_calls: [toolCall],
          },
          {
            role: 'tool',
            tool_call_id: toolCall.id,
            name: functionName,
            content: JSON.stringify(result),
          },
        ],
        stream: true,
      });

      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          for await (const chunk of finalResponse) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          }
          controller.close();
        },
      });

      return new Response(stream, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return new Response(`Function execution error: ${message}`, { status: 500 });
    }
  }

  // If no function is called, just return the normal response (streaming)
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const content = choice.message.content;
      if (content) {
        controller.enqueue(encoder.encode(content));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};