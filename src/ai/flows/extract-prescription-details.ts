'use server';

/**
 * @fileOverview Extracts medicine details (name, dosage, frequency, etc.) from a prescription image.
 *
 * - extractPrescriptionDetails -  A function that handles the prescription details extraction process.
 * - ExtractPrescriptionDetailsInput - The input type for the extractPrescriptionDetails function.
 * - ExtractPrescriptionDetailsOutput - The return type for the extractPrescriptionDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractPrescriptionDetailsInputSchema = z.object({
  prescriptionImage: z
    .string()
    .describe(
      "A photo of a handwritten prescription, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractPrescriptionDetailsInput = z.infer<
  typeof ExtractPrescriptionDetailsInputSchema
>;

const MedicineDetailsSchema = z.object({
  medicineName: z.string().describe('The name of the medicine.'),
  dosage: z.string().describe('The dosage of the medicine (e.g., 500mg).'),
  frequency: z
    .string()
    .describe('How often the medicine should be taken (e.g., twice daily).'),
  duration: z
    .string()
    .describe('How long the medicine should be taken for (e.g. 7 days).')
    .optional(),
  routeOfAdministration: z
    .string()
    .describe('How the medicine should be administered (e.g. orally, topical).')
    .optional(),
  instructions: z
    .string()
    .describe('Any special instructions (e.g., with food, before bed).')
    .optional(),
});

const ExtractPrescriptionDetailsOutputSchema = z.object({
  medicines: z.array(MedicineDetailsSchema).describe('List of extracted medicines with details.'),
  doctorName: z.string().describe('The name of the doctor.').optional(),
  clinicInformation: z.string().describe('The clinic information.').optional(),
  patientName: z.string().describe('The patient name.').optional(),
  dateOfPrescription: z.string().describe('The date of the prescription.').optional(),
});
export type ExtractPrescriptionDetailsOutput = z.infer<
  typeof ExtractPrescriptionDetailsOutputSchema
>;

export async function extractPrescriptionDetails(
  input: ExtractPrescriptionDetailsInput
): Promise<ExtractPrescriptionDetailsOutput> {
  return extractPrescriptionDetailsFlow(input);
}

const extractPrescriptionDetailsPrompt = ai.definePrompt({
  name: 'extractPrescriptionDetailsPrompt',
  input: {schema: ExtractPrescriptionDetailsInputSchema},
  output: {schema: ExtractPrescriptionDetailsOutputSchema},
  prompt: `You are a medical expert extracting information from a prescription image.
  Extract the following information for each prescribed item:
  - Medicine Name
  - Dosage
  - Frequency
  - Duration (if available)
  - Route of Administration (if available)
  - Instructions (if available)

  Also, attempt to extract:
  - Doctor's Name
  - Clinic Information
  - Patient Name (if available)
  - Date of Prescription (if available)

  Structure the output clearly, associating all details with the respective medicine.

  Prescription Image: {{media url=prescriptionImage}}
  `,
});

const extractPrescriptionDetailsFlow = ai.defineFlow(
  {
    name: 'extractPrescriptionDetailsFlow',
    inputSchema: ExtractPrescriptionDetailsInputSchema,
    outputSchema: ExtractPrescriptionDetailsOutputSchema,
  },
  async input => {
    const {output} = await extractPrescriptionDetailsPrompt(input);
    return output!;
  }
);
