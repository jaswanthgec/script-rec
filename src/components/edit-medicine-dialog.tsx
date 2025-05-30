import React, { useState, useEffect } from 'react';
import type { MedicineDetails } from '../types';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea'; // Assuming Textarea is available or created

interface EditMedicineDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  medicine: MedicineDetails | null;
  onSave: (updatedMedicine: MedicineDetails) => void;
}

const EditMedicineDialog: React.FC<EditMedicineDialogProps> = ({ isOpen, onOpenChange, medicine, onSave }) => {
  const [formData, setFormData] = useState<Partial<MedicineDetails>>({});

  useEffect(() => {
    if (medicine) {
      setFormData(medicine);
    }
  }, [medicine]);

  if (!medicine) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave({ ...medicine, ...formData } as MedicineDetails);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] bg-card">
        <DialogHeader>
          <DialogTitle className="text-primary">Edit Medicine: {medicine.medicineName}</DialogTitle>
          <DialogDescription>
            Make changes to the extracted medicine details below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
          {[
            { id: 'medicineName', label: 'Medicine Name', type: 'text' },
            { id: 'dosage', label: 'Dosage', type: 'text' },
            { id: 'frequency', label: 'Frequency', type: 'text' },
            { id: 'duration', label: 'Duration', type: 'text' },
            { id: 'routeOfAdministration', label: 'Route of Administration', type: 'text' },
            { id: 'instructions', label: 'Instructions', type: 'textarea' },
          ].map(field => (
            <div className="grid grid-cols-4 items-center gap-4" key={field.id}>
              <Label htmlFor={field.id} className="text-right col-span-1 text-foreground">
                {field.label}
              </Label>
              {field.type === 'textarea' ? (
                 <Textarea
                    id={field.id}
                    name={field.id}
                    value={formData[field.id as keyof MedicineDetails] as string || ''}
                    onChange={handleChange}
                    className="col-span-3"
                    rows={3}
                  />
              ) : (
                <Input
                  id={field.id}
                  name={field.id}
                  value={formData[field.id as keyof MedicineDetails] as string || ''}
                  onChange={handleChange}
                  className="col-span-3"
                />
              )}
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="button" onClick={handleSave} className="bg-accent hover:bg-accent/90 text-accent-foreground">Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditMedicineDialog;
