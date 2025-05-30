'use client';

import React, { useState, useRef, useCallback } from 'react';
import type { ScreenView, PrescriptionData } from '@/types';
import { extractPrescriptionDetails, ExtractPrescriptionDetailsInput } from '@/ai/flows/extract-prescription-details';

import UploadScreen from '@/components/screens/upload-screen';
import ImagePreviewScreen from '@/components/screens/image-preview-screen';
import ProcessingScreen from '@/components/screens/processing-screen';
import ResultsScreen from '@/components/screens/results-screen';
import ErrorScreen from '@/components/screens/error-screen';
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs for medicines

// Helper to install uuid if not already installed: npm install uuid @types/uuid
// (Assuming uuid is available or to be added to package.json by a separate process if needed)

export default function HomePage() {
  const [currentScreen, setCurrentScreen] = useState<ScreenView>('upload');
  const [imageDataUri, setImageDataUri] = useState<string | null>(null);
  const [prescriptionData, setPrescriptionData] = useState<PrescriptionData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetToUpload = useCallback(() => {
    setImageDataUri(null);
    setPrescriptionData(null);
    setError(null);
    setCurrentScreen('upload');
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset file input
    }
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // Limit file size to 4MB (Gemini API limit)
        toast({
          title: "File too large",
          description: "Please select an image smaller than 4MB.",
          variant: "destructive",
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageDataUri(reader.result as string);
        setCurrentScreen('preview');
        setError(null);
      };
      reader.onerror = () => {
        setError("Failed to read the image file.");
        setCurrentScreen('error');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!imageDataUri) {
      setError("No image data to analyze.");
      setCurrentScreen('error');
      return;
    }

    setCurrentScreen('processing');
    setIsLoading(true);
    setError(null);

    try {
      const input: ExtractPrescriptionDetailsInput = { prescriptionImage: imageDataUri };
      const result = await extractPrescriptionDetails(input);
      
      const processedMedicines = result.medicines.map(med => ({
        ...med,
        id: uuidv4(), // Add a unique ID to each medicine
      }));

      setPrescriptionData({ ...result, medicines: processedMedicines });
      setCurrentScreen('results');
    } catch (e: any) {
      console.error("Analysis failed:", e);
      setError(e.message || "An unknown error occurred during analysis. The image might be too blurry, unclear, or the content unrecognizable.");
      setCurrentScreen('error');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePrescriptionUpdate = (updatedData: PrescriptionData) => {
    setPrescriptionData(updatedData);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'upload':
        return (
          <UploadScreen
            onFileUpload={(event) => handleFileChange(event)}
            fileInputRef={fileInputRef}
          />
        );
      case 'preview':
        return (
          <ImagePreviewScreen
            imageDataUri={imageDataUri!}
            onAnalyze={handleAnalyze}
            onRetake={resetToUpload}
          />
        );
      case 'processing':
        return <ProcessingScreen />;
      case 'results':
        return (
          <ResultsScreen
            prescriptionData={prescriptionData!}
            originalImage={imageDataUri!}
            onScanAnother={resetToUpload}
            onUpdatePrescriptionData={handlePrescriptionUpdate}
          />
        );
      case 'error':
        return (
          <ErrorScreen
            errorMessage={error || "An unexpected error occurred."}
            onTryAgainWithNewImage={resetToUpload}
            onTryAnalyzingAgain={imageDataUri ? handleAnalyze : undefined}
          />
        );
      default:
        return <UploadScreen onFileUpload={handleFileChange} fileInputRef={fileInputRef} />;
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8 bg-background">
      <div className="w-full max-w-2xl">
        {renderScreen()}
      </div>
    </main>
  );
}
