import { createContext, useContext, type ReactNode } from 'react';
import type { CardAssignment } from '@/features/accounting-authorization/interfaces/card-assignment';
import { mockCardAssignments } from '@/features/accounting-authorization/store/mock-data';

interface CardAssignmentContextType {
  cardAssignments: CardAssignment[];
}

const CardAssignmentContext = createContext<
  CardAssignmentContextType | undefined
>(undefined);

export function CardAssignmentProvider({ children }: { children: ReactNode }) {
  const cardAssignments = mockCardAssignments;

  return (
    <CardAssignmentContext.Provider value={{ cardAssignments }}>
      {children}
    </CardAssignmentContext.Provider>
  );
}

export function useCardAssignmentContext() {
  const context = useContext(CardAssignmentContext);
  if (context === undefined) {
    throw new Error(
      'useCardAssignmentContext must be used within a CardAssignmentProvider',
    );
  }
  return context;
}
