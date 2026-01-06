import type { Table } from '@tanstack/react-table';

import {
  Button,
  Checkbox,
  MenuContent,
  MenuItem,
  MenuPositioner,
  MenuRoot,
  MenuTrigger,
  Portal,
} from '@chakra-ui/react';
import { LuColumns3 } from 'react-icons/lu';

type ColumnVisibilityMenuProps<TData> = {
  table: Table<TData>;
};

const ColumnVisibilityMenu = <TData,>({ table }: ColumnVisibilityMenuProps<TData>) => {
  // Get all columns that can be hidden
  const columns = table.getAllColumns().filter((column) => column.getCanHide());

  // If no hideable columns, don't render the menu
  if (columns.length === 0) {
    return null;
  }

  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <Button size="sm" variant="outline">
          <LuColumns3 />
          Columns
        </Button>
      </MenuTrigger>
      <Portal>
        <MenuPositioner>
          <MenuContent>
            {columns.map((column) => {
              const title = typeof column.columnDef.header === 'string' ? column.columnDef.header : column.id;

              return (
                <MenuItem
                  key={column.id}
                  value={column.id}
                  closeOnSelect={false}
                  onClick={() => column.toggleVisibility()}>
                  <Checkbox.Root checked={column.getIsVisible()} readOnly>
                    <Checkbox.Control />
                    <Checkbox.Label>{title}</Checkbox.Label>
                  </Checkbox.Root>
                </MenuItem>
              );
            })}
          </MenuContent>
        </MenuPositioner>
      </Portal>
    </MenuRoot>
  );
};

export { ColumnVisibilityMenu };
