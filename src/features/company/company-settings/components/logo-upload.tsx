import { useRef, useState } from 'react';

import { Box, Button, Flex, Icon, Image, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Building2, Trash2, Upload } from 'lucide-react';

type LogoUploadProps = {
  currentLogoUrl: string | null;
  onFileSelected: (file: File | null) => void;
  disabled?: boolean;
};

const ACCEPTED_TYPES = 'image/jpeg,image/png,image/webp,image/svg+xml';

const LogoUpload = ({ currentLogoUrl, onFileSelected, disabled }: LogoUploadProps) => {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isRemoved, setIsRemoved] = useState(false);

  const displayUrl = isRemoved ? null : (previewUrl ?? currentLogoUrl);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
      setIsRemoved(false);
      onFileSelected(file);
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    setIsRemoved(true);
    onFileSelected(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <Box>
      <Text fontSize="sm" fontWeight="medium" mb={2}>
        {t('companySettings.general.logo')}
      </Text>
      <Flex align="center" gap={4}>
        <Box
          w="80px"
          h="80px"
          borderRadius="lg"
          borderWidth="1px"
          overflow="hidden"
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg="bg.subtle"
        >
          {displayUrl ? (
            <Image src={displayUrl} alt="Company logo" objectFit="cover" w="full" h="full" />
          ) : (
            <Icon boxSize={8} color="fg.muted">
              <Building2 />
            </Icon>
          )}
        </Box>
        <Flex direction="column" gap={2}>
          <Text fontSize="xs" color="fg.muted">
            {t('companySettings.general.logoDescription')}
          </Text>
          <Flex gap={2}>
            <Button size="xs" variant="outline" onClick={() => inputRef.current?.click()} disabled={disabled}>
              <Icon boxSize={3}>
                <Upload />
              </Icon>
              {t('companySettings.general.changeLogo')}
            </Button>
            {displayUrl && (
              <Button size="xs" variant="ghost" colorPalette="red" onClick={handleRemove} disabled={disabled}>
                <Icon boxSize={3}>
                  <Trash2 />
                </Icon>
                {t('companySettings.general.removeLogo')}
              </Button>
            )}
          </Flex>
        </Flex>
      </Flex>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </Box>
  );
};

export { LogoUpload };
