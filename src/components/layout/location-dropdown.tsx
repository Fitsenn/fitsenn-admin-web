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
import { Check, ChevronDown, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useLocation } from '@/contexts';

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
              <MapPin />
            </Icon>
            <Text fontSize="sm" fontWeight="medium" maxW="150px" truncate>
              {selectedLocation?.name ?? t('location.selectLocation')}
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
            {locations.map((location) => {
              const isSelected = location.id === selectedLocation?.id;
              return (
                <MenuItem
                  key={location.id}
                  value={location.id}
                  onClick={() => setSelectedLocationId(location.id)}
                  cursor="pointer">
                  <Flex align="center" gap={3} flex={1}>
                    <Icon boxSize={4} color="fg.muted">
                      <MapPin />
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

export { LocationDropdown };
