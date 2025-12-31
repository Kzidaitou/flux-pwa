
import { PackageOpen } from 'lucide-react'
import { EmptyState } from './EmptyState'

export const HistoryEmptyState = () => (
  <EmptyState 
    icon={<PackageOpen size={40} />}
    title="No History Yet"
    description="Your charging adventures haven't started. Find a station to get moving!"
  />
)