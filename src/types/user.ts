import type { Tables } from './database.types';
import type { SnakeToCamel } from './utility_types';

export type DatabaseUserProfile = Tables<'profiles'> & { email: string };
export type UserProfile = SnakeToCamel<DatabaseUserProfile>;
