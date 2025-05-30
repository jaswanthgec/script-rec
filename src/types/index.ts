import type { ExtractPrescriptionDetailsOutput as FullPrescriptionData, MedicineDetails as AIMedicineDetails } from '../ai/flows/extract-prescription-details';

export type ScreenView = 'upload' | 'preview' | 'processing' | 'results' | 'error' | 'cameraCapture';

export interface MedicineDetails extends AIMedicineDetails {
  id: string; // Add a unique ID for list rendering and editing
}

export interface PrescriptionData extends Omit<FullPrescriptionData, 'medicines'> {
  medicines: MedicineDetails[];
}
