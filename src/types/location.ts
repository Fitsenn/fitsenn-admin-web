/** Time slot with open/close times as minutes from midnight in UTC */
export type TimeSlot = {
  /** Minutes from midnight (0-1439) in UTC */
  open: number;
  /** Minutes from midnight (0-1439) in UTC */
  close: number;
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
