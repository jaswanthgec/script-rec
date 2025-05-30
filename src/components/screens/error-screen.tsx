import React from 'react';
import { Button } from '../ui/button';
import { AlertTriangle, Info, RotateCcw, ScanSearch } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';

interface ErrorScreenProps {
  errorMessage: string;
  onTryAgainWithNewImage: () => void;
  onTryAnalyzingAgain?: () => void; // Optional: if original image can be re-analyzed
}

const ErrorScreen: React.FC<ErrorScreenProps> = ({ errorMessage, onTryAgainWithNewImage, onTryAnalyzingAgain }) => {
  return (
    <Card className="w-full shadow-xl border-destructive">
      <CardHeader className="bg-destructive/10">
        <CardTitle className="flex items-center text-destructive text-2xl">
          <AlertTriangle size={28} className="mr-3" />
          Analysis Failed
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <p className="text-destructive-foreground text-center text-base">
          {errorMessage}
        </p>
        
        <div className="p-4 bg-muted/50 rounded-lg border border-dashed border-input">
          <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center">
            <Info size={16} className="mr-2 text-primary" />
            Tips for a Better Scan:
          </h4>
          <ul className="list-disc list-inside text-xs text-muted-foreground space-y-1">
            <li>Ensure good, even lighting. Avoid shadows and glare.</li>
            <li>Place the prescription on a flat, contrasting surface.</li>
            <li>Make sure the text is clear and in focus.</li>
            <li>Hold your phone steady while taking the picture.</li>
            <li>Capture the entire prescription, avoiding cutoff edges.</li>
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-center gap-4 p-6">
        <Button onClick={onTryAgainWithNewImage} variant="outline" size="lg" className="w-full sm:w-auto">
          <RotateCcw size={20} className="mr-2" />
          Try with New Image
        </Button>
        {onTryAnalyzingAgain && (
          <Button onClick={onTryAnalyzingAgain} size="lg" className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
            <ScanSearch size={20} className="mr-2" />
            Try Analyzing Current Image Again
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ErrorScreen;
