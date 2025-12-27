export const generateGameCode = async (prompt: string): Promise<string> => {
  const prod1 = "https://codetoplay-node-api.onrender.com/generate-game";
  const prod2 = "https://codetoplay-groq-api.vercel.app/generate-game";
  const groq = "http://localhost:3001/generate-game";
  const gem2 = "http://localhost:5000/generate-game";
  try {
    const response = await fetch(prod1, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();

    if (data.gameCode) {
      return data.gameCode.replace(/```javascript|```/g, "").trim(); // Clean up code formatting
    } else {
      throw new Error("Invalid game code received");
    }
  } catch (error) {
    console.error("Error fetching game code:", error);
    throw new Error("Failed to generate game");
  }
};
