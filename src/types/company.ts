import type { Tables } from './database.types';
import type { SnakeToCamel } from './utility_types';

export type DatabaseCompany = Tables<'companies'>;

export type Company = SnakeToCamel<DatabaseCompany>;
