import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScanLine, RotateCcw } from 'lucide-react';

interface ImagePreviewScreenProps {
  imageDataUri: string;
  onAnalyze: () => void;
  onRetake: () => void;
}

const ImagePreviewScreen: React.FC<ImagePreviewScreenProps> = ({ imageDataUri, onAnalyze, onRetake }) => {
  return (
    <Card className="w-full shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Verify Your Prescription</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-6">
        <div className="w-full max-w-md aspect-[4/3] relative rounded-lg overflow-hidden border-2 border-primary shadow-inner">
          <Image 
            src={imageDataUri} 
            alt="Uploaded Prescription" 
            fill
            style={{ objectFit: 'contain' }}
            data-ai-hint="medical prescription"
          />
        </div>
        <p className="text-sm text-muted-foreground text-center">
          Ensure the image is clear, well-lit, and the entire prescription is visible.
        </p>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-center gap-4 p-6">
        <Button onClick={onRetake} variant="outline" size="lg" className="w-full sm:w-auto">
          <RotateCcw size={20} className="mr-2" />
          Retake or Choose Different
        </Button>
        <Button onClick={onAnalyze} size="lg" className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
          <ScanLine size={20} className="mr-2" />
          Analyze Prescription
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ImagePreviewScreen;
