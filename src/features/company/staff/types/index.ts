import type { UserProfile } from '@/types/user';
import type { SnakeToCamel } from '@/types/utility_types';

export type DatabaseCompanyUser = {
  user_id: string;
  roles: string[] | null;
  joined_at: string;
  profile: UserProfile;
};

export type CompanyUser = SnakeToCamel<DatabaseCompanyUser>;
