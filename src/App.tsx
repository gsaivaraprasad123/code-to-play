import { useState } from 'react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Card } from './components/ui/card';
import { Wand2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { useToast } from "./hooks/use-toast";
import CodeEditor from './components/code-editor';
import GamePreview from './components/game-preview';

function App() {
  const [prompt, setPrompt] = useState('');
  const [gameCode, setGameCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a game description",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    try {
      const response = await fetch('https://code-to-play-api.vercel.app/generate-game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate game');
      }
      
      if (data.gameCode) {
        // Extract the actual code from the markdown code block
        const codeMatch = data.gameCode.match(/```javascript\n([\s\S]*?)```/);
        const extractedCode = codeMatch ? codeMatch[1] : data.gameCode;
        setGameCode(extractedCode);
        toast({
          title: "Game Generated!",
          description: "Your game has been created successfully.",
        });
      } else {
        throw new Error('No game code was generated');
      }
    } catch (error) {
      console.error('Failed to generate game:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate game",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([gameCode], {type: 'text/javascript'});
    element.href = URL.createObjectURL(file);
    element.download = 'game.js';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">AI Game Generator</h1>
          <p className="text-muted-foreground">
            Transform your ideas into playable 2D games using AI
          </p>
        </div>

        <Card className="p-6">
          <div className="flex gap-4">
            <Input
              placeholder="Describe your game idea... (e.g., 'Make a flappy bird game')"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
            >
              <Wand2 className="mr-2 h-4 w-4" />
              {isGenerating ? 'Generating...' : 'Generate Game'}
            </Button>
          </div>
        </Card>

        <Tabs defaultValue="preview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="preview">Game Preview</TabsTrigger>
            <TabsTrigger value="code">Code Editor</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="space-y-4">
            <div className="aspect-video rounded-lg overflow-hidden border bg-card">
              <GamePreview code={gameCode} />
            </div>
          </TabsContent>

          <TabsContent value="code" className="space-y-4">
            <div className="h-[600px] rounded-lg overflow-hidden border">
              <CodeEditor
                value={gameCode}
                onChange={setGameCode}
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button
            onClick={handleDownload}
            disabled={!gameCode}
            variant="outline"
          >
            Download Game
          </Button>
        </div>
      </div>
    </main>
  );
}

export default App;