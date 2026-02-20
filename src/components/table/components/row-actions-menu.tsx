import type { RowAction, RowActionsConfig } from '../types';

import { useMemo } from 'react';

import {
  Icon,
  IconButton,
  MenuContent,
  MenuItem,
  MenuPositioner,
  MenuRoot,
  MenuSeparator,
  MenuTrigger,
  Portal,
  Text,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Copy, EllipsisVertical, Eye, Pencil, Trash2 } from 'lucide-react';

import { isBuiltInAction } from '../types';

type RowActionsMenuProps<TData> = {
  row: TData;
  config: RowActionsConfig<TData>;
};

const BUILT_IN_ACTIONS = {
  view: {
    icon: Eye,
    translationKey: 'table.actions.view',
    isDestructive: false,
    requiresEdit: false,
    requiresDelete: false,
  },
  edit: {
    icon: Pencil,
    translationKey: 'table.actions.edit',
    isDestructive: false,
    requiresEdit: true,
    requiresDelete: false,
  },
  duplicate: {
    icon: Copy,
    translationKey: 'table.actions.duplicate',
    isDestructive: false,
    requiresEdit: true,
    requiresDelete: false,
  },
  delete: {
    icon: Trash2,
    translationKey: 'table.actions.delete',
    isDestructive: true,
    requiresEdit: false,
    requiresDelete: true,
  },
} as const;

const RowActionsMenu = <TData,>({ row, config }: RowActionsMenuProps<TData>) => {
  const { t } = useTranslation();
  const { actions, canEdit = false, canDelete = canEdit } = config;

  const visibleActions = useMemo(() => {
    return actions
      .map((action) => {
        // Check custom isVisible condition first
        if (action.isVisible && !action.isVisible(row)) {
          return undefined;
        }

        // For built-in actions, apply canEdit/canDelete logic
        if (isBuiltInAction(action)) {
          const builtIn = BUILT_IN_ACTIONS[action.type];

          // If action requires delete permission and user can't delete, hide it
          if (builtIn.requiresDelete && !canDelete) {
            return undefined;
          }

          // If action requires edit permission and user can't edit, hide it
          if (builtIn.requiresEdit && !canEdit) {
            if (action.type === 'edit') {
              // If action is edit and user doesn't have edit permission, show 'view' action
              return { ...action, type: 'view' };
            }
            return undefined;
          }

          // If action doesn't require edit or delete (view) and user can edit, hide it
          if (!builtIn.requiresEdit && !builtIn.requiresDelete && canEdit) {
            return undefined;
          }
        }

        // Custom actions are always visible (unless isVisible returns false above)
        return action;
      })
      .filter(Boolean) as RowAction<TData>[];
  }, [actions, canEdit, canDelete, row]);

  if (visibleActions.length === 0) {
    return null;
  }

  const renderAction = (action: RowAction<TData>, index: number) => {
    if (isBuiltInAction(action)) {
      const builtIn = BUILT_IN_ACTIONS[action.type];
      const IconComponent = builtIn.icon;

      return (
        <MenuItem
          key={action.type}
          value={action.type}
          onClick={() => action.onClick(row)}
          cursor="pointer"
          color={builtIn.isDestructive ? 'red.500' : undefined}>
          <Icon boxSize={4}>
            <IconComponent />
          </Icon>
          <Text>{action.label ?? t(builtIn.translationKey)}</Text>
        </MenuItem>
      );
    }

    // Custom action
    return (
      <span key={action.id}>
        {action.hasSeparator && index > 0 && <MenuSeparator />}
        <MenuItem
          value={action.id}
          onClick={() => action.onClick(row)}
          cursor="pointer"
          color={action.isDestructive ? 'red.500' : undefined}>
          {action.icon && <Icon boxSize={4}>{action.icon}</Icon>}
          <Text>{action.label}</Text>
        </MenuItem>
      </span>
    );
  };

  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <IconButton
          aria-label={t('table.actions.openMenu')}
          size="xs"
          variant="ghost"
          onClick={(e) => e.stopPropagation()}>
          <EllipsisVertical />
        </IconButton>
      </MenuTrigger>
      <Portal>
        <MenuPositioner>
          <MenuContent minW="150px">{visibleActions.map((action, index) => renderAction(action, index))}</MenuContent>
        </MenuPositioner>
      </Portal>
    </MenuRoot>
  );
};

export { RowActionsMenu };
