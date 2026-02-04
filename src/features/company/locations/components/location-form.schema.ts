import { z } from 'zod';

export const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

export const TIER_OPTIONS = [
  { value: '', label: '' },
  { value: 'standard', label: 'Standard' },
  { value: 'gold', label: 'Gold' },
  { value: 'platinum', label: 'Platinum' },
];

export type FormTimeSlot = { open: string; close: string };

export const DEFAULT_TIME_SLOT: FormTimeSlot = { open: '09:00', close: '21:00' };

const timeSlotSchema = z.object({
  open: z.string(),
  close: z.string(),
});

export const locationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  address: z.string().optional(),
  tier: z.string().optional(),
  is_active: z.boolean(),
  operating_hours: z.record(z.array(timeSlotSchema).nullable()).optional(),
});

export type LocationFormData = z.infer<typeof locationSchema>;
