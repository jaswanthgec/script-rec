import React, { useState } from 'react';
import Image from 'next/image';
import type { PrescriptionData, MedicineDetails } from '@/types';
import MedicineCard from '@/components/medicine-card';
import EditMedicineDialog from '@/components/edit-medicine-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, CheckCircle, Copy, Share2, FileScan, Maximize } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

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
      toast({ title: "Copied to clipboard!", icon: <CheckCircle className="h-5 w-5 text-green-500" /> });
    } catch (err) {
      toast({ title: "Failed to copy", description: "Could not copy text to clipboard.", variant: "destructive" });
    }
  };
  
  const handleShare = async () => {
    const shareData = {
      title: 'Prescription Insights',
      text: formatPrescriptionText(),
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback for browsers that don't support navigator.share
        handleCopyToClipboard();
        toast({ title: "Share not supported", description: "Content copied to clipboard instead." });
      }
    } catch (err) {
      console.error('Share failed:', err);
      // If share fails (e.g. user cancels), copy to clipboard as a fallback
      handleCopyToClipboard();
      toast({ title: "Share cancelled or failed", description: "Content copied to clipboard instead.", variant: "destructive" });
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
          <ScrollArea className="h-[calc(100vh-26rem)] md:h-[calc(80vh-16rem)] lg:h-[500px]"> {/* Adjust height as needed */}
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
                  <h3 className="text-lg font-semibold text-foreground mb-3">Other Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                    {prescriptionData.doctorName && (<div><strong>Doctor:</strong> <span className="text-muted-foreground">{prescriptionData.doctorName}</span></div>)}
                    {prescriptionData.clinicInformation && (<div><strong>Clinic:</strong> <span className="text-muted-foreground">{prescriptionData.clinicInformation}</span></div>)}
                    {prescriptionData.dateOfPrescription && (<div><strong>Date:</strong> <span className="text-muted-foreground">{prescriptionData.dateOfPrescription}</span></div>)}
                    {prescriptionData.patientName && (<div><strong>Patient:</strong> <span className="text-muted-foreground">{prescriptionData.patientName}</span></div>)}
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
