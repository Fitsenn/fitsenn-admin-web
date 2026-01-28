export type TimeSlot = {
  open: string;
  close: string;
};

export type OperatingHours = {
  monday?: TimeSlot[] | null;
  tuesday?: TimeSlot[] | null;
  wednesday?: TimeSlot[] | null;
  thursday?: TimeSlot[] | null;
  friday?: TimeSlot[] | null;
  saturday?: TimeSlot[] | null;
  sunday?: TimeSlot[] | null;
};

export type Location = {
  id: string;
  company_id: string;
  name: string;
  address: string | null;
  tier: string | null;
  is_active: boolean;
  operating_hours: OperatingHours | null;
  created_at: string;
  updated_at: string;
};
