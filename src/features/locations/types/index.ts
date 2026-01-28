export type { Location, OperatingHours, TimeSlot } from '@/types/location';

export type CreateLocationInput = {
  company_id: string;
  name: string;
  address?: string | null;
  tier?: string | null;
  is_active?: boolean;
  operating_hours?: import('@/types/location').OperatingHours | null;
};

export type UpdateLocationInput = {
  location_id: string;
  name: string;
  address?: string | null;
  tier?: string | null;
  is_active?: boolean;
  operating_hours?: import('@/types/location').OperatingHours | null;
};
