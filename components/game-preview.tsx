import { useEffect, useRef, useState } from "react";

interface GamePreviewProps {
  code: string;
}

export default function GamePreview({ code }: GamePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = useState(480);

  useEffect(() => {
    const updateHeight = () => {
      if (iframeRef.current) {
        setIframeHeight(iframeRef.current.clientWidth * 0.6); // Maintain 16:9 aspect ratio
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return (
    <div className="relative w-full border rounded-lg overflow-hidden">
      {code ? (
        <iframe
          ref={iframeRef}
          srcDoc={`<html>
            <head>
              <style>
                body { margin: 0; overflow: hidden; display: flex; justify-content: center; align-items: center; height: 100vh; }
                canvas { display: block; }
              </style>
              <script src="https://cdnjs.cloudflare.com/ajax/libs/phaser/3.55.2/phaser.min.js"></script>
            </head>
            <body>
              <script>
                try {
                  ${code}
                } catch (error) {
                  document.body.innerHTML = '<h3 style="color:red;text-align:center;">Failed to load game</h3>';
                  console.error(error);
                }
              </script>
            </body>
          </html>`}
          className="w-full border"
          style={{ height: `${iframeHeight}px` }}
        />
      ) : (
        <p className="text-center text-muted-foreground p-4">Game preview will appear here.</p>
      )}
    </div>
  );
}
