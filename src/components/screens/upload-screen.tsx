import React from 'react';
import AppLogo from '@/components/app-logo';
import { Button } from '@/components/ui/button';
import { UploadCloud, Camera } from 'lucide-react';

interface UploadScreenProps {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

const UploadScreen: React.FC<UploadScreenProps> = ({ onFileUpload, fileInputRef }) => {
  const triggerFileSelect = () => fileInputRef.current?.click();

  return (
    <div className="flex flex-col items-center justify-center text-center p-6 rounded-lg shadow-xl bg-card min-h-[calc(100vh-10rem)] md:min-h-0 md:max-h-[80vh] md:aspect-[3/4] md:w-auto">
      <AppLogo className="mb-6" iconSize={48} textSize="text-5xl" />
      <p className="text-muted-foreground mb-10 text-lg">
        Instant Prescription Decoder
      </p>
      
      <input
        type="file"
        accept="image/*"
        onChange={onFileUpload}
        ref={fileInputRef}
        className="hidden"
        id="prescriptionUpload"
      />

      <Button 
        onClick={triggerFileSelect} 
        size="lg" 
        className="w-full max-w-xs text-lg py-8 rounded-xl shadow-md hover:shadow-lg transition-shadow bg-primary hover:bg-primary/90"
        aria-label="Scan Prescription or Upload Image"
      >
        <UploadCloud size={28} className="mr-3" />
        Scan or Upload Image
      </Button>
      
      <p className="text-xs text-muted-foreground mt-6">
        You can use your camera or select an image from your gallery.
      </p>

      {/* Optional: Direct camera access button - modern browsers handle this with accept="image/*" capture="environment" */}
      {/* For a more explicit button:
      <Button 
        onClick={() => {
          if (fileInputRef.current) {
            fileInputRef.current.setAttribute('capture', 'environment');
            fileInputRef.current.click();
          }
        }}
        variant="outline"
        size="lg"
        className="w-full max-w-xs text-lg py-4 mt-4 rounded-xl"
      >
        <Camera size={24} className="mr-2" />
        Use Camera
      </Button> 
      */}
    </div>
  );
};

export default UploadScreen;
