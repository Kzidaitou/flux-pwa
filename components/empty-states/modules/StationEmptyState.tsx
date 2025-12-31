import { SearchX } from 'lucide-react'
import { EmptyState } from './EmptyState'

export const StationEmptyState = () => (
  <EmptyState 
    icon={<SearchX size={40} />}
    title="No Stations Found"
    description="Try adjusting your filters or search area to find charging points nearby."
  />
)