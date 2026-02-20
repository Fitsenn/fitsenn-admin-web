import { type ReactNode, useEffect } from 'react';

import { useUserCompanies } from '@/api/get-user-companies';
import { type CompanyContextValue, CompanyContext } from '@/contexts';
import { useLocalStorage } from '@/hooks/use-local-storage';

const STORAGE_KEY = 'fitsenn_selected_company_id';

type CompanyProviderProps = {
  children: ReactNode;
};

const CompanyProvider = ({ children }: CompanyProviderProps) => {
  const { data: companies } = useUserCompanies();
  const [selectedCompanyId, setSelectedCompanyId] = useLocalStorage(STORAGE_KEY, '');

  // Derive selected company synchronously — fall back to first company
  const selectedCompany = companies.find((c) => c.id === selectedCompanyId) ?? companies[0] ?? null;

  // Persist auto-selected company to localStorage
  useEffect(() => {
    if (selectedCompany && selectedCompany.id !== selectedCompanyId) {
      setSelectedCompanyId(selectedCompany.id);
    }
  }, [selectedCompany, selectedCompanyId, setSelectedCompanyId]);

  const value: CompanyContextValue = {
    companies,
    selectedCompany,
    setSelectedCompanyId,
  };

  return <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>;
};

export { CompanyProvider };
