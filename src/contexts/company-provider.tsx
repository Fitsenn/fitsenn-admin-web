import { type ReactNode, useEffect } from 'react';

import { useUserCompanies } from '@/api/get-user-companies';
import { type CompanyContextValue, CompanyContext } from '@/contexts';
import { useLocalStorage } from '@/hooks/use-local-storage';

const STORAGE_KEY = 'fitsenn_selected_company_id';

type CompanyProviderProps = {
  children: ReactNode;
};

const CompanyProvider = ({ children }: CompanyProviderProps) => {
  const { data: companies = [], isLoading, isError } = useUserCompanies();
  const [selectedCompanyId, setSelectedCompanyId] = useLocalStorage(STORAGE_KEY, '');

  // Auto-select first company if none selected or selected no longer exists
  useEffect(() => {
    const hasValidSelection = selectedCompanyId && companies.some((c) => c.id === selectedCompanyId);
    if (companies.length > 0 && !hasValidSelection) {
      setSelectedCompanyId(companies[0].id);
    }
  }, [companies, selectedCompanyId, setSelectedCompanyId]);

  const selectedCompany = companies.find((c) => c.id === selectedCompanyId) ?? null;

  const value: CompanyContextValue = {
    companies,
    selectedCompany,
    setSelectedCompanyId,
    isLoading,
    isError,
  };

  return <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>;
};

export { CompanyProvider };
