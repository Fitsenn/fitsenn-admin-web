import type { Tables } from './database.types';
import type { Replace, SnakeToCamel } from './utility_types';

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

export type DatabaseLocation = Replace<Tables<'locations'>, { operating_hours: OperatingHours }>;

export type Location = SnakeToCamel<DatabaseLocation>;
