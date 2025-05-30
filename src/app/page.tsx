'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import type { ScreenView, PrescriptionData } from '../types';
import { extractPrescriptionDetails, ExtractPrescriptionDetailsInput } from '../ai/flows/extract-prescription-details';

import UploadScreen from '../components/screens/upload-screen';
import ImagePreviewScreen from '../components/screens/image-preview-screen';
import ProcessingScreen from '../components/screens/processing-screen';
import ResultsScreen from '../components/screens/results-screen';
import ErrorScreen from '../components/screens/error-screen';
import CameraCaptureScreen from '../components/screens/camera-capture-screen'; // New import
import { useToast } from "../hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';

export default function HomePage() {
  const [currentScreen, setCurrentScreen] = useState<ScreenView>('upload');
  const [imageDataUri, setImageDataUri] = useState<string | null>(null);
  const [prescriptionData, setPrescriptionData] = useState<PrescriptionData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isCameraInitializing, setIsCameraInitializing] = useState<boolean>(false);

  useEffect(() => {
    if (currentScreen === 'cameraCapture') {
      const getCameraPermission = async () => {
        setIsCameraInitializing(true);
        setHasCameraPermission(null);
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          toast({
            variant: 'destructive',
            title: 'Camera Not Supported',
            description: 'Your browser does not support camera access or is not available in the current context (e.g. HTTP).',
          });
          setHasCameraPermission(false);
          setIsCameraInitializing(false);
          setCurrentScreen('upload');
          return;
        }
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          setHasCameraPermission(true);
        } catch (err) {
          console.error('Error accessing camera:', err);
          setHasCameraPermission(false);
          toast({
            variant: 'destructive',
            title: 'Camera Access Denied',
            description: 'Please enable camera permissions in your browser settings.',
          });
        } finally {
          setIsCameraInitializing(false);
        }
      };
      getCameraPermission();

      return () => {
        if (videoRef.current && videoRef.current.srcObject) {
          const stream = videoRef.current.srcObject as MediaStream;
          stream.getTracks().forEach(track => track.stop());
          videoRef.current.srcObject = null;
        }
      };
    }
  }, [currentScreen, toast]);

  const resetToUpload = useCallback(() => {
    setImageDataUri(null);
    setPrescriptionData(null);
    setError(null);
    setCurrentScreen('upload');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
    }
    setHasCameraPermission(null);
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
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
        id: uuidv4(),
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

  const handleOpenCamera = () => {
    setCurrentScreen('cameraCapture');
  };

  const handleCapturePhoto = () => {
    if (videoRef.current && canvasRef.current && hasCameraPermission) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      const stream = video.srcObject as MediaStream;
      if (!stream) {
        setError("Camera stream not available.");
        setCurrentScreen('error');
        return;
      }
      const track = stream.getVideoTracks()[0];
      const settings = track.getSettings();
      
      canvas.width = settings.width || video.videoWidth;
      canvas.height = settings.height || video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        // Flip image horizontally if front camera was used (optional, depends on desired UX)
        // if (settings.facingMode === 'user') {
        //   context.translate(canvas.width, 0);
        //   context.scale(-1, 1);
        // }
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUri = canvas.toDataURL('image/jpeg');

        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        
        setImageDataUri(dataUri);
        setCurrentScreen('preview');
        setError(null);
        setHasCameraPermission(null); // Reset permission state
      } else {
        setError("Failed to capture image from camera context.");
        setCurrentScreen('error');
      }
    } else {
      setError("Camera not ready or permission denied.");
      setCurrentScreen('error');
    }
  };

  const handleCloseCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
    }
    setCurrentScreen('upload');
    setHasCameraPermission(null);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'upload':
        return (
          <UploadScreen
            onFileUpload={(event) => handleFileChange(event)}
            fileInputRef={fileInputRef}
            onOpenCamera={handleOpenCamera}
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
      case 'cameraCapture':
        return (
          <CameraCaptureScreen
            videoRef={videoRef}
            canvasRef={canvasRef}
            onCapturePhoto={handleCapturePhoto}
            onCloseCamera={handleCloseCamera}
            hasCameraPermission={hasCameraPermission}
            isInitializing={isCameraInitializing}
            toast={toast}
          />
        );
      default:
        return <UploadScreen onFileUpload={handleFileChange} fileInputRef={fileInputRef} onOpenCamera={handleOpenCamera} />;
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8 bg-background">
      <div className="w-full max-w-2xl">
        {renderScreen()}
        {/* Hidden canvas for capturing photo */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    </main>
  );
}
