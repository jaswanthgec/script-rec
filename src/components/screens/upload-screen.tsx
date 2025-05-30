import React from 'react';
import AppLogo from '@/components/app-logo';
import { Button } from '@/components/ui/button';
import { UploadCloud, Camera } from 'lucide-react';

interface UploadScreenProps {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onOpenCamera: () => void;
}

const UploadScreen: React.FC<UploadScreenProps> = ({ onFileUpload, fileInputRef, onOpenCamera }) => {
  const triggerFileSelect = () => fileInputRef.current?.click();

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 sm:p-10 rounded-xl shadow-2xl bg-card border border-border/50 w-full max-w-md mx-auto">
      <AppLogo className="mb-6 text-primary" iconSize={48} textSize="text-4xl" />
      <h2 className="text-2xl font-semibold text-foreground mb-3">
        Instant Prescription Decoder
      </h2>
      <p className="text-muted-foreground mb-10 text-base max-w-xs">
        Snap a photo or upload an image of your prescription to get quick insights.
      </p>
      
      <input
        type="file"
        accept="image/*"
        onChange={onFileUpload}
        ref={fileInputRef}
        className="hidden"
        id="prescriptionUpload"
      />

      <div className="w-full max-w-sm space-y-4">
        <Button 
          onClick={onOpenCamera}
          size="lg" 
          className="w-full text-lg py-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out bg-primary hover:bg-primary/90 text-primary-foreground transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary/30"
          aria-label="Capture with Camera"
        >
          <Camera size={28} className="mr-3" />
          Capture with Camera
        </Button>

        <Button 
          onClick={triggerFileSelect} 
          size="lg" 
          variant="outline"
          className="w-full text-lg py-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out border-primary text-primary hover:bg-primary/10 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary/30"
          aria-label="Upload Image from Gallery"
        >
          <UploadCloud size={28} className="mr-3" />
          Upload from Gallery
        </Button>
      </div>
      
      <p className="text-xs text-muted-foreground mt-8 px-4">
        Ensure the image is clear and well-lit for best results. Max file size: 4MB.
      </p>
    </div>
  );
};

export default UploadScreen;
