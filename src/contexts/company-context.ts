import { createContext } from 'react';

import type { Company } from '@/types/company';

export type CompanyContextValue = {
  companies: Company[];
  selectedCompany: Company | null;
  setSelectedCompanyId: (companyId: string) => void;
  isLoading: boolean;
  isError: boolean;
};

export const CompanyContext = createContext<CompanyContextValue | null>(null);
