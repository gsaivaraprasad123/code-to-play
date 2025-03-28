import { useEffect, useRef } from 'react';

interface GamePreviewProps {
  code: string;
}

export default function GamePreview({ code }: GamePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameInstanceRef = useRef<any>(null);

  useEffect(() => {
    // Load Phaser script if it hasn't been loaded yet
    if (!window.Phaser) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/phaser@3.70.0/dist/phaser.min.js';
      script.async = true;
      script.onload = () => initGame();
      document.body.appendChild(script);
    } else {
      initGame();
    }

    function initGame() {
      if (!code || !containerRef.current) return;

      // Clean up previous game instance
      if (gameInstanceRef.current) {
        gameInstanceRef.current.destroy(true);
        gameInstanceRef.current = null;
      }

      try {
        // Create a new script element with the game code
        const script = document.createElement('script');
        script.textContent = code;
        
        // Append scripts to container
        containerRef.current.innerHTML = '<div id="game-container"></div>';
        containerRef.current.appendChild(script);
      } catch (error) {
        console.error('Error initializing game:', error);
      }
    }

    // Cleanup function
    return () => {
      if (gameInstanceRef.current) {
        gameInstanceRef.current.destroy(true);
        gameInstanceRef.current = null;
      }
    };
  }, [code]);

  return (
    <div ref={containerRef} className="w-full h-full" />
  );
}