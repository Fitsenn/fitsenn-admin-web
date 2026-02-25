import type { FlatSidebarItem, SidebarItem } from './sidebar.types';

import { Building2, CreditCard, House, MapPin, Settings, Users2, Users } from 'lucide-react';

export const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    type: 'link',
    labelKey: 'navigation.dashboard',
    to: '/dashboard',
    icon: <House />,
  },
  {
    type: 'link',
    labelKey: 'navigation.users',
    to: '/users',
    icon: <Users />,
    permission: 'users:read',
  },
  {
    type: 'group',
    labelKey: 'navigation.company',
    icon: <Building2 />,
    children: [
      {
        labelKey: 'navigation.companyLocations',
        to: '/company/locations',
        icon: <MapPin />,
        permission: 'locations:read',
      },
      {
        labelKey: 'navigation.companyStaff',
        to: '/company/staff',
        icon: <Users2 />,
        permission: 'staff:read',
      },
      {
        labelKey: 'navigation.companyMemberships',
        to: '/company/memberships',
        icon: <CreditCard />,
        permission: 'company-memberships:read',
      },
      {
        labelKey: 'navigation.companySettings',
        to: '/company/settings',
        icon: <Settings />,
        permission: 'company-settings:read',
      },
    ],
  },
];

export const flattenSidebarItems = (items: SidebarItem[]): FlatSidebarItem[] => {
  return items.reduce<FlatSidebarItem[]>((acc, item) => {
    if (item.type === 'link') {
      acc.push({
        labelKey: item.labelKey,
        to: item.to,
        icon: item.icon,
        permission: item.permission,
      });
    } else {
      item.children.forEach((child) => {
        acc.push({
          labelKey: child.labelKey,
          to: child.to,
          icon: child.icon ?? item.icon,
          permission: child.permission,
        });
      });
    }
    return acc;
  }, []);
};
