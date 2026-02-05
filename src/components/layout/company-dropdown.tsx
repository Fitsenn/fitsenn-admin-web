import {
  Avatar,
  Box,
  Button,
  Flex,
  Icon,
  MenuContent,
  MenuItem,
  MenuPositioner,
  MenuRoot,
  MenuTrigger,
  Portal,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Building2, Check, ChevronDown } from 'lucide-react';

import { useCompany } from '@/hooks/use-company';

const CompanyDropdown = () => {
  const { t } = useTranslation();
  const { companies, selectedCompany, setSelectedCompanyId, isLoading } = useCompany();

  if (isLoading) {
    return <Spinner size="sm" />;
  }

  if (companies.length === 0) {
    return null;
  }

  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <Button variant="ghost" px={3} cursor="pointer">
          <Flex align="center" gap={2}>
            <Avatar.Root size="xs">
              {selectedCompany?.logoUrl ? (
                <Avatar.Image src={selectedCompany.logoUrl} alt={selectedCompany.name} />
              ) : (
                <Avatar.Fallback>
                  <Icon boxSize={4}>
                    <Building2 />
                  </Icon>
                </Avatar.Fallback>
              )}
            </Avatar.Root>
            <Text fontSize="sm" fontWeight="medium" maxW="150px" truncate>
              {selectedCompany?.name ?? t('company.selectCompany')}
            </Text>
            <Icon boxSize={4} color="fg.muted">
              <ChevronDown />
            </Icon>
          </Flex>
        </Button>
      </MenuTrigger>
      <Portal>
        <MenuPositioner>
          <MenuContent minW="220px">
            <Box px={3} py={2}>
              <Text fontSize="xs" color="fg.muted" fontWeight="medium">
                {t('company.yourCompanies')}
              </Text>
            </Box>
            {companies.map((company) => {
              const isSelected = company.id === selectedCompany?.id;
              return (
                <MenuItem
                  key={company.id}
                  value={company.id}
                  onClick={() => setSelectedCompanyId(company.id)}
                  cursor="pointer"
                >
                  <Flex align="center" gap={3} flex={1}>
                    <Avatar.Root size="xs">
                      {company.logoUrl ? (
                        <Avatar.Image src={company.logoUrl} alt={company.name} />
                      ) : (
                        <Avatar.Fallback>
                          <Icon boxSize={3}>
                            <Building2 />
                          </Icon>
                        </Avatar.Fallback>
                      )}
                    </Avatar.Root>
                    <Text fontSize="sm" flex={1}>
                      {company.name}
                    </Text>
                    {isSelected && (
                      <Icon boxSize={4} color="brand.500">
                        <Check />
                      </Icon>
                    )}
                  </Flex>
                </MenuItem>
              );
            })}
          </MenuContent>
        </MenuPositioner>
      </Portal>
    </MenuRoot>
  );
};

export { CompanyDropdown };
