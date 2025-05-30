import React from 'react';
import { Loader2 } from 'lucide-react';
import AppLogo from '../app-logo';

const ProcessingScreen: React.FC = () => {
  const messages = [
    "Analyzing Prescription...",
    "Extracting Medical Insights...",
    "Decoding Handwritten Text...",
    "Powered by Gemini AI."
  ];
  const [currentMessageIndex, setCurrentMessageIndex] = React.useState(0);

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 2500);
    return () => clearInterval(intervalId);
  }, [messages.length]);

  return (
    <div className="flex flex-col items-center justify-center text-center p-6 rounded-lg shadow-xl bg-card min-h-[calc(100vh-10rem)] md:min-h-0 md:max-h-[80vh] md:aspect-[3/4] md:w-auto">
      <AppLogo className="mb-8" iconSize={40} textSize="text-4xl" />
      <Loader2 className="h-16 w-16 animate-spin text-primary mb-6" />
      <p className="text-xl font-semibold text-foreground mb-2">
        {messages[currentMessageIndex]}
      </p>
      <p className="text-sm text-muted-foreground">
        This may take a few moments. Please wait.
      </p>
    </div>
  );
};

export default ProcessingScreen;
