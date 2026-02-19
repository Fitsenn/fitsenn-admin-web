export const PERMISSIONS = [
  'dashboard:access',
  'users:read',
  'users:write',
  'users:delete',
  'company-settings:read',
  'company-settings:write',
  'staff:read',
  'staff:write',
  'staff:invite',
  'staff:delete',
  'locations:read',
  'locations:write',
  'locations:delete',
  'bookings:read',
  'bookings:write',
] as const;

export type Permission = (typeof PERMISSIONS)[number];

type ExtractResource<P> = P extends `${infer R}:${string}` ? R : never;
export type Resource = ExtractResource<Permission>;

type ExtractAction<P, R extends string> = P extends `${R}:${infer A}` ? A : never;
export type ActionForResource<R extends Resource> = ExtractAction<Permission, R>;

export type HasPermissionFn = <R extends Resource>(resource: R, action: ActionForResource<R>) => boolean;
