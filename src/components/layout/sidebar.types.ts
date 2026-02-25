import type { Permission } from '@/types/permissions';
import type { FileRouteTypes } from '@/routeTree.gen';
import type { ReactNode } from 'react';

type BaseSidebarItem = {
  labelKey: string;
  icon: ReactNode;
  permission?: Permission;
};

export type SidebarLinkItem = BaseSidebarItem & {
  type: 'link';
  to: FileRouteTypes['to'];
};

export type SidebarChildItem = {
  labelKey: string;
  to: FileRouteTypes['to'];
  icon?: ReactNode;
  permission?: Permission;
};

export type SidebarGroupItem = BaseSidebarItem & {
  type: 'group';
  children: SidebarChildItem[];
};

export type SidebarItem = SidebarLinkItem | SidebarGroupItem;

export type FlatSidebarItem = {
  labelKey: string;
  to: FileRouteTypes['to'];
  icon: ReactNode;
  permission?: Permission;
};
