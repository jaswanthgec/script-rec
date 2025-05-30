import React from 'react';
import AppLogo from '@/components/app-logo';
import { Button } from '@/components/ui/button';
import { UploadCloud } from 'lucide-react';

interface UploadScreenProps {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

const UploadScreen: React.FC<UploadScreenProps> = ({ onFileUpload, fileInputRef }) => {
  const triggerFileSelect = () => fileInputRef.current?.click();

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 sm:p-10 rounded-xl shadow-2xl bg-card border border-border/50 w-full max-w-md mx-auto">
      <AppLogo className="mb-8 text-primary" iconSize={52} textSize="text-5xl" />
      <p className="text-foreground/80 mb-12 text-xl px-2">
        Instant Prescription Decoder
      </p>
      
      <input
        type="file"
        accept="image/*" // Restricts to image files
        capture="environment" // Prefers rear camera on mobile
        onChange={onFileUpload}
        ref={fileInputRef}
        className="hidden"
        id="prescriptionUpload"
      />

      <Button 
        onClick={triggerFileSelect} 
        size="lg" 
        className="w-full max-w-sm text-xl py-7 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out bg-accent hover:bg-accent/90 text-accent-foreground transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-accent/30"
        aria-label="Scan Prescription or Upload Image"
      >
        <UploadCloud size={32} className="mr-4" />
        Scan or Upload Image
      </Button>
      
      <p className="text-sm text-muted-foreground mt-8 px-4">
        Use your camera or select an image from your gallery.
      </p>
    </div>
  );
};

export default UploadScreen;
