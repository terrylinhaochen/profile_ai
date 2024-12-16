// src/app/api/chat/route.js
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request) {
  try {
    const { userProfile, message, chatHistory } = await request.json();

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a knowledgeable book recommendation assistant. 
            Current user profile:
            - Areas of Interest: ${userProfile.areas.join(', ')}
            - Inspirations: ${userProfile.inspirations.join(', ')}
            Consider this context when providing recommendations and discussing books.`
        },
        ...chatHistory.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return NextResponse.json({
      content: response.choices[0].message.content,
      prefills: [
        "What aspects of this topic interest you the most?",
        "Would you like to explore similar books in this area?",
        "How does this relate to your current reading goals?"
      ]
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}