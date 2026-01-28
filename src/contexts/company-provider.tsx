import { type ReactNode, useEffect, useState } from 'react';

import { useUserCompanies } from '@/api/get-user-companies';
import { type CompanyContextValue, CompanyContext } from '@/contexts/company-context';

const STORAGE_KEY = 'fitsenn_selected_company_id';

type CompanyProviderProps = {
  children: ReactNode;
};

const CompanyProvider = ({ children }: CompanyProviderProps) => {
  const { data: companies = [], isLoading, isError } = useUserCompanies();
  const [selectedCompanyId, setSelectedCompanyIdState] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEY);
    }
    return null;
  });

  const setSelectedCompanyId = (companyId: string) => {
    setSelectedCompanyIdState(companyId);
    localStorage.setItem(STORAGE_KEY, companyId);
  };

  useEffect(() => {
    if (companies.length > 0 && !selectedCompanyId) {
      const firstCompany = companies[0];
      setSelectedCompanyId(firstCompany.id);
    }
  }, [companies, selectedCompanyId]);

  useEffect(() => {
    if (
      companies.length > 0 &&
      selectedCompanyId &&
      !companies.some((c) => c.id === selectedCompanyId)
    ) {
      const firstCompany = companies[0];
      setSelectedCompanyId(firstCompany.id);
    }
  }, [companies, selectedCompanyId]);

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
