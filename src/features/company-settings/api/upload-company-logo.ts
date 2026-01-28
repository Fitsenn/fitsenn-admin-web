import { useMutation } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';

type UploadLogoInput = {
  companyId: string;
  file: File;
};

const uploadCompanyLogo = async ({ companyId, file }: UploadLogoInput): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const filePath = `${companyId}/logo.${fileExt}`;

  const { error } = await supabase.storage.from('company-logos').upload(filePath, file, {
    upsert: true,
  });

  if (error) {
    console.error('Error uploading company logo:', error);
    throw error;
  }

  const { data: urlData } = supabase.storage.from('company-logos').getPublicUrl(filePath);

  return `${urlData.publicUrl}?t=${Date.now()}`;
};

export const useUploadCompanyLogo = () => {
  return useMutation({ mutationFn: uploadCompanyLogo });
};
