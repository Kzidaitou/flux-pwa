import { CreditCard } from 'lucide-react'
import { EmptyState } from './EmptyState'

export const PaymentEmptyState = () => (
  <EmptyState 
    icon={<CreditCard size={40} />}
    title="No Cards Found"
    description="Link a credit or debit card for faster, seamless charging payments."
  />
)