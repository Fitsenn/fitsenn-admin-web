/** Time slot with open/close times in local HH:MM format */
export type TimeSlot = {
  /** Opening time in HH:MM format (e.g., "09:00") */
  open: string;
  /** Closing time in HH:MM format (e.g., "18:00") */
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
