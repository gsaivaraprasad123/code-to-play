import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

// Validate API key exists
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error('GEMINI_API_KEY is not configured in environment variables');
}

const genAI = new GoogleGenerativeAI(apiKey);

const SYSTEM_PROMPT = `You are an expert game developer specializing in creating 2D games using Phaser.js. 
When given a game description, generate complete, working Phaser.js game code.

Guidelines:
1. Always create a complete game scene class named 'gameScene'
2. Include preload(), create(), and update() methods
3. Add proper physics, collisions, and game mechanics
4. Include score tracking where appropriate
5. Add game over conditions and restart functionality
6. Use keyboard inputs (arrow keys, spacebar) for controls
7. Ensure the code is clean, well-commented, and bug-free

The code should work with this Phaser configuration:
{
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: gameScene
}`;

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // For code generation, we'll use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent([
      SYSTEM_PROMPT,
      prompt
    ]);
    const response = await result.response;
    const generatedCode = response.text();
    
    if (!generatedCode) {
      throw new Error('No code was generated');
    }

    return NextResponse.json({ code: generatedCode });
  } catch (error) {
    console.error('Error generating game code:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate game code';
    
    // Check for specific Gemini API errors
    if (errorMessage.includes('API key')) {
      return NextResponse.json(
        { error: 'Gemini API configuration error. Please check your API key.' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}