import React, { useState } from 'react';
import Image from 'next/image';
import type { PrescriptionData, MedicineDetails } from '../../types';
import MedicineCard from '../medicine-card';
import EditMedicineDialog from '../edit-medicine-dialog';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { AlertCircle, CheckCircle, Copy, Share2, FileScan, Maximize } from 'lucide-react';
import { useToast } from "../../hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';

interface ResultsScreenProps {
  prescriptionData: PrescriptionData;
  originalImage: string;
  onScanAnother: () => void;
  onUpdatePrescriptionData: (updatedData: PrescriptionData) => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ prescriptionData, originalImage, onScanAnother, onUpdatePrescriptionData }) => {
  const [editingMedicine, setEditingMedicine] = useState<MedicineDetails | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleEditMedicine = (medicine: MedicineDetails) => {
    setEditingMedicine(medicine);
    setIsEditDialogOpen(true);
  };

  const handleSaveMedicine = (updatedMedicine: MedicineDetails) => {
    const updatedMedicines = prescriptionData.medicines.map(med =>
      med.id === updatedMedicine.id ? updatedMedicine : med
    );
    onUpdatePrescriptionData({ ...prescriptionData, medicines: updatedMedicines });
    toast({ title: "Success", description: `${updatedMedicine.medicineName} updated.` });
  };

  const formatPrescriptionText = () => {
    let text = `Prescription Insights:\n\n`;
    text += `Medicines:\n`;
    prescriptionData.medicines.forEach((med, index) => {
      text += `${index + 1}. ${med.medicineName || 'N/A'}\n`;
      if (med.dosage) text += `   - Dosage: ${med.dosage}\n`;
      if (med.frequency) text += `   - Frequency: ${med.frequency}\n`;
      if (med.duration) text += `   - Duration: ${med.duration}\n`;
      if (med.routeOfAdministration) text += `   - Route: ${med.routeOfAdministration}\n`;
      if (med.instructions) text += `   - Instructions: ${med.instructions}\n`;
      text += '\n';
    });

    if (prescriptionData.doctorName || prescriptionData.clinicInformation || prescriptionData.dateOfPrescription || prescriptionData.patientName) {
      text += `Other Information:\n`;
      if (prescriptionData.doctorName) text += ` - Doctor: ${prescriptionData.doctorName}\n`;
      if (prescriptionData.clinicInformation) text += ` - Clinic: ${prescriptionData.clinicInformation}\n`;
      if (prescriptionData.dateOfPrescription) text += ` - Date: ${prescriptionData.dateOfPrescription}\n`;
      if (prescriptionData.patientName) text += ` - Patient: ${prescriptionData.patientName}\n`; // Consider privacy implications
    }
    return text;
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(formatPrescriptionText());
      toast({ title: "Copied to clipboard!"});
    } catch (err) {
      toast({ title: "Failed to copy", description: "Could not copy text to clipboard.", variant: "destructive" });
    }
  };
  
  const handleShare = async () => {
    const shareData = {
      title: 'ScriptAssist Prescription Insights',
      text: formatPrescriptionText(),
    };

    let toastTitle = "";
    let toastDescription = "";
    let toastVariant: "default" | "destructive" = "default";
    let copySuccessful = false;

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return; 
      } else {
        // Web Share API not supported
        try {
          await navigator.clipboard.writeText(formatPrescriptionText());
          copySuccessful = true;
        } catch (copyError) {
          console.error("Copy to clipboard failed (share not supported):", copyError);
        }
        toastTitle = "Share Not Supported";
        toastDescription = copySuccessful 
          ? "Web Share is not available in your browser. Content copied to clipboard instead." 
          : "Web Share is not available, and failed to copy content to clipboard.";
        toastVariant = copySuccessful ? "default" : "destructive";
      }
    } catch (err: any) {
      console.error('Share failed:', err);
      
      try {
        await navigator.clipboard.writeText(formatPrescriptionText());
        copySuccessful = true;
      } catch (copyError) {
        console.error("Copy to clipboard failed during share fallback:", copyError);
      }

      if (err.name === 'AbortError') { 
        toastTitle = "Share Cancelled";
        toastDescription = copySuccessful 
          ? "Sharing was cancelled. Content has been copied to your clipboard." 
          : "Sharing was cancelled, and failed to copy content to clipboard.";
        toastVariant = "default";
      } else if (err.name === 'NotAllowedError') { 
        toastTitle = "Share Permission Denied";
        toastDescription = copySuccessful 
          ? "Could not share due to permission issues (e.g., not on HTTPS). Content copied to clipboard." 
          : "Could not share due to permissions, and also failed to copy content to clipboard.";
        toastVariant = copySuccessful ? "default" : "destructive"; 
      } else { 
        toastTitle = "Share Error";
        toastDescription = copySuccessful 
          ? `An error occurred: ${err.message || 'Unknown error'}. Content copied to clipboard.`
          : `An error occurred: ${err.message || 'Unknown error'}, and failed to copy content to clipboard.`;
        toastVariant = "destructive";
      }
    }
    
    if (toastTitle) {
      toast({ title: toastTitle, description: toastDescription, variant: toastVariant });
    }
  };


  return (
    <div className="w-full space-y-6">
      <Card className="shadow-xl overflow-hidden">
        <CardHeader className="bg-primary/10">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl text-primary">Prescription Insights</CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="View original prescription image">
                  <Maximize className="h-5 w-5 text-primary" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh]">
                <DialogHeader>
                  <DialogTitle>Original Prescription Image</DialogTitle>
                </DialogHeader>
                <div className="relative w-full aspect-[3/4] max-h-[75vh] overflow-hidden rounded-md">
                    <Image src={originalImage} alt="Original Prescription" fill style={{ objectFit: 'contain' }} data-ai-hint="medical prescription" />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-26rem)] md:h-[calc(80vh-16rem)] lg:h-[500px]">
            <div className="p-6">
              {prescriptionData.medicines.length > 0 ? (
                prescriptionData.medicines.map(medicine => (
                  <MedicineCard key={medicine.id} medicine={medicine} onEdit={handleEditMedicine} />
                ))
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No medicines found in the prescription.</p>
                </div>
              )}

              {(prescriptionData.doctorName || prescriptionData.clinicInformation || prescriptionData.dateOfPrescription || prescriptionData.patientName) && (
                <>
                  <Separator className="my-6" />
                  <div className="mt-4 p-4 rounded-lg bg-muted/30 border border-border/70 shadow-sm">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Other Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                      {prescriptionData.doctorName && (<div className="space-y-1"><strong>Doctor:</strong> <p className="text-muted-foreground">{prescriptionData.doctorName}</p></div>)}
                      {prescriptionData.clinicInformation && (<div className="space-y-1"><strong>Clinic:</strong> <p className="text-muted-foreground">{prescriptionData.clinicInformation}</p></div>)}
                      {prescriptionData.dateOfPrescription && (<div className="space-y-1"><strong>Date:</strong> <p className="text-muted-foreground">{prescriptionData.dateOfPrescription}</p></div>)}
                      {prescriptionData.patientName && (<div className="space-y-1"><strong>Patient:</strong> <p className="text-muted-foreground">{prescriptionData.patientName}</p></div>)}
                    </div>
                  </div>
                </>
              )}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-end gap-3 p-4 border-t bg-primary/5">
          <Button variant="outline" onClick={handleCopyToClipboard}>
            <Copy size={18} className="mr-2" /> Copy All
          </Button>
          <Button variant="outline" onClick={handleShare}>
            <Share2 size={18} className="mr-2" /> Share
          </Button>
          <Button onClick={onScanAnother} className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <FileScan size={18} className="mr-2" /> Scan Another
          </Button>
        </CardFooter>
      </Card>

      {editingMedicine && (
        <EditMedicineDialog
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          medicine={editingMedicine}
          onSave={handleSaveMedicine}
        />
      )}
    </div>
  );
};

export default ResultsScreen;
