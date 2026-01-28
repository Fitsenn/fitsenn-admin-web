import {
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
import { LuCheck, LuChevronDown, LuMapPin } from 'react-icons/lu';

import { useLocation } from '@/hooks/use-location';

const LocationDropdown = () => {
  const { t } = useTranslation();
  const { locations, selectedLocation, setSelectedLocationId, isLoading } = useLocation();

  if (isLoading) {
    return <Spinner size="sm" />;
  }

  if (locations.length === 0) {
    return null;
  }

  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <Button variant="ghost" px={3} cursor="pointer">
          <Flex align="center" gap={2}>
            <Icon boxSize={4} color="fg.muted">
              <LuMapPin />
            </Icon>
            <Text fontSize="sm" fontWeight="medium" maxW="150px" truncate>
              {selectedLocation?.name ?? t('location.selectLocation')}
            </Text>
            <Icon boxSize={4} color="fg.muted">
              <LuChevronDown />
            </Icon>
          </Flex>
        </Button>
      </MenuTrigger>
      <Portal>
        <MenuPositioner>
          <MenuContent minW="220px">
            {locations.map((location) => {
              const isSelected = location.id === selectedLocation?.id;
              return (
                <MenuItem
                  key={location.id}
                  value={location.id}
                  onClick={() => setSelectedLocationId(location.id)}
                  cursor="pointer"
                >
                  <Flex align="center" gap={3} flex={1}>
                    <Icon boxSize={4} color="fg.muted">
                      <LuMapPin />
                    </Icon>
                    <Flex direction="column" flex={1}>
                      <Text fontSize="sm">{location.name}</Text>
                      {location.address && (
                        <Text fontSize="xs" color="fg.muted">
                          {location.address}
                        </Text>
                      )}
                    </Flex>
                    {isSelected && (
                      <Icon boxSize={4} color="brand.500">
                        <LuCheck />
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

export { LocationDropdown };
