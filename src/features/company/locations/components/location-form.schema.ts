import { z } from 'zod';

export const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

export type Weekday = (typeof DAYS)[number];

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

const daySchema = z.array(timeSlotSchema).nullable().optional();

export const locationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  address: z.string().optional(),
  tier: z.string().optional(),
  isActive: z.boolean(),
  operatingHours: z
    .object({
      monday: daySchema,
      tuesday: daySchema,
      wednesday: daySchema,
      thursday: daySchema,
      friday: daySchema,
      saturday: daySchema,
      sunday: daySchema,
    })
    .optional(),
});

export type LocationFormData = z.infer<typeof locationSchema>;
