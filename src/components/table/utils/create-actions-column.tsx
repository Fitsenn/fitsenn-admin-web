import type { ColumnDef } from '@tanstack/react-table';
import type { RowActionsConfig } from '../types';

import { RowActionsMenu } from '../components/row-actions-menu';

const createActionsColumn = <TData,>(config: RowActionsConfig<TData>): ColumnDef<TData> => {
  return {
    id: '_actions',
    header: config.columnHeader ?? '',
    enableSorting: false,
    enableHiding: false,
    size: 45,
    minSize: 45,
    maxSize: 45,
    cell: ({ row }) => (
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <RowActionsMenu row={row.original} config={config} />
      </div>
    ),
  };
};

export { createActionsColumn };
