import type { Company } from '@/types/company';

import { createContext, useContext } from 'react';

type CompanyContextValue = {
  companies: Company[];
  selectedCompany: Company | null;
  setSelectedCompanyId: (companyId: string) => void;
  isLoading: boolean;
  isError: boolean;
};

const CompanyContext = createContext<CompanyContextValue | null>(null);

const useCompany = () => {
  const context = useContext(CompanyContext);

  if (!context) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }

  return context;
};

export { CompanyContext, useCompany };
export type { CompanyContextValue };
