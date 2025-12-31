import React from 'react'
import { CarFront } from 'lucide-react'
import { EmptyState } from './EmptyState'

interface VehicleEmptyStateProps {
  onAdd: () => void
}

export const VehicleEmptyState: React.FC<VehicleEmptyStateProps> = ({ onAdd }) => (
  <EmptyState 
    icon={<CarFront size={40} />}
    title="Register Vehicle"
    description="Add your EV details to get accurate compatibility and estimated costs."
    action={
      <button onClick={onAdd} className="bg-primary text-dark font-bold py-3 px-8 rounded-xl active:scale-95 transition-all shadow-lg shadow-green-500/20">
        Add My First Car
      </button>
    }
  />
)