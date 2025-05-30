import React from 'react';
import type { MedicineDetails } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Pill, Droplets, Edit3, HelpCircle, Eye, Ear, Wind, Layers, Pipette, BotMessageSquare } from 'lucide-react';

interface MedicineCardProps {
  medicine: MedicineDetails;
  onEdit: (medicine: MedicineDetails) => void;
}

const getMedicineIcon = (route?: string, name?: string) => {
  const r = route?.toLowerCase() || '';
  const n = name?.toLowerCase() || '';

  if (r.includes('oral') || r.includes('tablet') || r.includes('capsule') || n.includes('tablet') || n.includes('pill') || n.includes('capsule')) return <Pill className="h-5 w-5 text-primary" />;
  if (r.includes('liquid') || r.includes('syrup') || r.includes('drops') || n.includes('syrup') || n.includes('solution') || n.includes('elixir')) {
    if (r.includes('eye') || r.includes('ophthalmic')) return <Eye className="h-5 w-5 text-primary" />;
    if (r.includes('ear') || r.includes('otic')) return <Ear className="h-5 w-5 text-primary" />;
    return <Droplets className="h-5 w-5 text-primary" />;
  }
  if (r.includes('topical') || r.includes('cream') || r.includes('ointment') || r.includes('gel') || n.includes('cream') || n.includes('ointment') || n.includes('gel')) return <Layers className="h-5 w-5 text-primary" />;
  if (r.includes('injection') || r.includes('injectable') || n.includes('injection')) return <Pipette className="h-5 w-5 text-primary" />; // Closest to Syringe
  if (r.includes('inhalation') || r.includes('inhaler') || n.includes('inhaler') || n.includes('spray')) return <Wind className="h-5 w-5 text-primary" />;
  if (r.includes('suppository')) return <BotMessageSquare className="h-5 w-5 text-primary" />; // Abstract
  
  return <HelpCircle className="h-5 w-5 text-muted-foreground" />; // Default icon
};


const MedicineCard: React.FC<MedicineCardProps> = ({ medicine, onEdit }) => {
  return (
    <Card className="mb-4 shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            {getMedicineIcon(medicine.routeOfAdministration, medicine.medicineName)}
            <CardTitle className="text-xl font-semibold text-primary">
              {medicine.medicineName || 'N/A'}
            </CardTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={() => onEdit(medicine)} aria-label={`Edit ${medicine.medicineName}`}>
            <Edit3 className="h-5 w-5 text-muted-foreground hover:text-primary" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
        {medicine.dosage && (
          <div>
            <strong className="text-foreground">Dosage:</strong>
            <p className="text-muted-foreground">{medicine.dosage}</p>
          </div>
        )}
        {medicine.frequency && (
          <div>
            <strong className="text-foreground">Frequency:</strong>
            <p className="text-muted-foreground">{medicine.frequency}</p>
          </div>
        )}
        {medicine.duration && (
          <div>
            <strong className="text-foreground">Duration:</strong>
            <p className="text-muted-foreground">{medicine.duration}</p>
          </div>
        )}
        {medicine.routeOfAdministration && (
          <div>
            <strong className="text-foreground">Route:</strong>
            <p className="text-muted-foreground">{medicine.routeOfAdministration}</p>
          </div>
        )}
        {medicine.instructions && (
          <div className="sm:col-span-2">
            <strong className="text-foreground">Instructions:</strong>
            <p className="text-muted-foreground whitespace-pre-wrap">{medicine.instructions}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MedicineCard;
