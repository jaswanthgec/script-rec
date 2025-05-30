import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Camera, Ban, Loader2, XCircle } from 'lucide-react';
import type { useToast } from "../../hooks/use-toast";


interface CameraCaptureScreenProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>; // For capturing, though hidden
  onCapturePhoto: () => void;
  onCloseCamera: () => void;
  hasCameraPermission: boolean | null;
  isInitializing: boolean;
  toast: ReturnType<typeof useToast>['toast']; // Pass toast for direct use if needed
}

const CameraCaptureScreen: React.FC<CameraCaptureScreenProps> = ({
  videoRef,
  // canvasRef is passed but not directly used in JSX here as it's hidden
  onCapturePhoto,
  onCloseCamera,
  hasCameraPermission,
  isInitializing,
  toast,
}) => {
  return (
    <Card className="w-full shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl text-center text-primary">Capture Prescription</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <div className="w-full max-w-md aspect-video bg-muted rounded-lg overflow-hidden relative border-2 border-primary shadow-inner">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
            muted
          />
          {isInitializing && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-background">
              <Loader2 className="h-12 w-12 animate-spin mb-4" />
              <p>Initializing Camera...</p>
            </div>
          )}
          {hasCameraPermission === false && !isInitializing && (
             <div className="absolute inset-0 flex flex-col items-center justify-center bg-destructive/80 text-destructive-foreground p-4">
              <Ban size={48} className="mb-4" />
              <h3 className="text-xl font-semibold mb-2">Camera Access Denied</h3>
              <p className="text-center text-sm">
                ScriptAssist needs camera access to capture prescriptions. 
                Please enable camera permissions in your browser settings and try again.
              </p>
            </div>
          )}
        </div>

        {hasCameraPermission === null && !isInitializing && (
           <Alert variant="default" className="w-full max-w-md">
            <AlertTitle>Camera Permission</AlertTitle>
            <AlertDescription>
              Requesting camera access. Please allow permission when prompted.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-center gap-4 p-6">
        <Button
          onClick={onCloseCamera}
          variant="outline"
          size="lg"
          className="w-full sm:w-auto"
        >
          <XCircle size={20} className="mr-2" />
          Cancel
        </Button>
        <Button
          onClick={onCapturePhoto}
          size="lg"
          className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground"
          disabled={hasCameraPermission !== true || isInitializing}
        >
          <Camera size={20} className="mr-2" />
          Capture Photo
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CameraCaptureScreen;
