import type { Tables } from './database.types';
import type { SnakeToCamel } from './utility-types';

export type DatabaseCompany = Tables<'companies'>;

export type Company = SnakeToCamel<DatabaseCompany>;

export type DatabaseMembershipPlan = Tables<'membership_plans'>;

export type MembershipPlan = SnakeToCamel<DatabaseMembershipPlan>;

export type DatabaseMembershipDiscount = Tables<'membership_discounts'>;

export type MembershipDiscount = SnakeToCamel<DatabaseMembershipDiscount>;
